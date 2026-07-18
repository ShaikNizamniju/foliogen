import { useState } from 'react';
import { Upload, Loader2, AlertCircle, RefreshCw, PenLine } from 'lucide-react';
import { supabase } from '@/lib/supabase_v2';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';

// Dynamically resolve worker URL to match installed pdfjs-dist version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function invokeParseWithRetry(
  resumeText: string,
  onRetry: () => void,
) {
  // Hard client-side timeout per attempt (90s). Without this, a flaky mobile
  // socket can leave supabase.functions.invoke hanging forever, so the UI
  // stays in "Processing…" and never resolves — this is what caused the
  // second-upload-never-updates bug. One automatic retry on failure.
  let lastErr: any = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const invokePromise = supabase.functions.invoke('parse-resume', {
        body: { resumeText },
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Client timeout after 90s')), 90000),
      );
      const { data, error } = (await Promise.race([invokePromise, timeoutPromise])) as any;
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    } catch (err: any) {
      lastErr = err;
      if (attempt === 0) {
        onRetry();
        await sleep(2000);
        continue;
      }
    }
  }
  throw lastErr;
}

export function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [failed, setFailed] = useState(false);
  const { updateProfile, saveProfile, refetchProfile } = useProfile();

  const goToManualEntry = () => {
    // ProfileSection listens to tab state internally; dispatch a hint event
    // and also scroll to the top so the user immediately sees the Basic Info form.
    window.dispatchEvent(new CustomEvent('profile:switchTab', { detail: 'basic' }));
    document.querySelector('[data-tour="profile"]')?.scrollIntoView({ behavior: 'smooth' });
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setLastFile(file);
    setFailed(false);
    setIsParsing(true);
    setStatusMessage('Reading your PDF…');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
      }

      if (!fullText || fullText.length < 50) {
        throw new Error("This PDF doesn't contain selectable text — it may be a scanned image.");
      }

      setStatusMessage('Analyzing with AI…');

      const data = await invokeParseWithRetry(fullText, () => {
        setStatusMessage('This is taking longer than usual — retrying automatically…');
      });

      console.log('[ResumeUpload] Raw parser payload →', data);

      const safeWorkExperience = (data.workExperience || []).map((w: any) => ({
        jobTitle: w.jobTitle || w.title || '',
        company: w.company || '',
        startDate: w.startDate || '',
        endDate: w.endDate || '',
        current: !!w.current,
        description: typeof w.description === 'string'
          ? w.description
          : Array.isArray(w.description) ? w.description.join(' ') : '',
        ...w,
        id: w.id || crypto.randomUUID(),
      }));
      const safeProjects = (data.projects || []).map((p: any) => ({
        title: p.title || '',
        description: typeof p.description === 'string'
          ? p.description
          : Array.isArray(p.description) ? p.description.join(' ') : '',
        link: p.link || '',
        imageUrl: p.imageUrl || '',
        ...p,
        id: p.id || crypto.randomUUID(),
      }));

      const general = data.narrativeVariants?.general || {};
      const headline = data.headline || general.headline || '';
      const bio = data.bio || general.bio || '';

      const cleared = { photoUrl: '', email: '', linkedinUrl: '', website: '' };
      const updates: any = {
        ...cleared,
        fullName: data.fullName || '',
        headline,
        bio,
        location: data.location || '',
        email: data.email ?? '',
        linkedinUrl: data.linkedinUrl ?? '',
        website: data.website ?? '',
        skills: Array.isArray(data.skills) ? data.skills : [],
        keyHighlights: Array.isArray(data.keyHighlights) ? data.keyHighlights : [],
        workExperience: safeWorkExperience,
        projects: safeProjects,
      };
      if (data.narrativeVariants) updates.narrativeVariants = data.narrativeVariants;
      if (data.predictedDomain) updates.predictedDomain = data.predictedDomain;

      updateProfile(updates);
      const { error: saveError } = await saveProfile(updates);
      if (saveError) {
        toast.error('Saved locally, but syncing failed. Try "Save Changes" once more.');
      } else {
        toast.success('Resume parsed. Review and save your updated profile.');
      }
      setFailed(false);
    } catch (error: any) {
      console.error('[ResumeUpload] Parsing failed →', error);
      setFailed(true);
      const msg = String(error?.message || '');
      let friendly = "We couldn't process this file. Try again, or fill in your details manually below.";
      if (/timed out|timeout|504/i.test(msg)) {
        friendly = "The AI took too long to respond. Try again, or fill in your details manually.";
      } else if (/scanned image|selectable text/i.test(msg)) {
        friendly = "This PDF looks like a scanned image. Please upload a text-based PDF or fill in your details manually.";
      } else if (/rate limit|429/i.test(msg)) {
        friendly = "Too many attempts right now. Please wait a minute and try again.";
      }
      setStatusMessage(friendly);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${isDragging ? 'border-primary bg-primary/5' : 'border-muted/25 hover:border-primary/50'}`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={isParsing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${isParsing ? 'bg-primary/10 animate-pulse' : 'bg-primary/5'}`}>
            {isParsing ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isParsing ? 'Processing Resume…' : 'Upload Resume or LinkedIn PDF'}
            </h3>
            <p className="text-sm text-muted-foreground min-h-[20px]">
              {isParsing
                ? (statusMessage || 'Extracting details…')
                : 'Drag & drop your PDF file here (max ~5 pages recommended)'}
            </p>
          </div>
        </div>
      </div>

      {failed && !isParsing && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div className="text-sm text-foreground">
              <p className="font-medium">Couldn't process your resume</p>
              <p className="text-muted-foreground mt-1">{statusMessage}</p>
              <p className="text-muted-foreground mt-2 text-xs">Nothing was saved to your profile.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => lastFile && processFile(lastFile)}
              className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
            <button
              type="button"
              onClick={goToManualEntry}
              className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md border border-border hover:bg-muted/50 transition"
            >
              <PenLine className="h-4 w-4" /> Fill in manually instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
