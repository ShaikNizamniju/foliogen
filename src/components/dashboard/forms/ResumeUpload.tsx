import { useState } from 'react';
import { Upload, Loader2, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase_v2';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';

// Dynamically resolve worker URL to match installed pdfjs-dist version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const { updateProfile, saveProfile } = useProfile();

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsParsing(true);
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
        throw new Error("PDF text is empty. It might be an image scan.");
      }

      toast.info('Analyzing with AI...');

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText: fullText }
      });

      if (error) {
        if (error.message && error.message.includes('Failed to send a request')) {
          throw new Error('Neural Parser Offline: Connection to Edge Function timed out or was blocked by CORS.');
        }
        throw new Error("Connection failed: " + error.message);
      }
      if (data?.error) throw new Error(data.error);

      // 🔍 DIAGNOSTIC: full raw payload from the parser. Helps verify schema
      // alignment with ProfileContext primitives (timeline / cards / pill-cloud /
      // badge-grid). Safe to keep — only logs in the user's own browser.
      console.log('[ResumeUpload] Raw parser payload →', data);

      // ── Schema mapping (parser camelCase → ProfileContext primitives) ──
      // timeline       ← workExperience
      // cards          ← projects
      // pill-cloud     ← skills
      // badge-grid     ← keyHighlights
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

      // Fall back to narrativeVariants.general for headline/bio when the
      // top-level fields are absent (older parser responses).
      const general = data.narrativeVariants?.general || {};
      const headline = data.headline || general.headline || '';
      const bio = data.bio || general.bio || '';

      // STEP 1: Clear identity-bound fields first so stale values from a
      // previous resume don't survive when the new PDF lacks them.
      const cleared = {
        photoUrl: '',
        email: '',
        linkedinUrl: '',
        website: '',
      };

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

      console.log('[ResumeUpload] Mapped profile updates →', updates);

      // STEP 2: Push to state IMMEDIATELY so the live preview re-renders
      // before the network round-trip to Supabase completes.
      updateProfile(updates);

      // STEP 3: Persist using the same saveProfile used by "Save Changes".
      try {
        const { error: saveError } = await saveProfile(updates);
        if (saveError) {
          toast.error('Parse failed. Please try again.');
        } else {
          toast.success('Resume parsed. Review and save your updated profile.');
        }
      } catch {
        toast.error('Parse failed. Please try again.');
      }



    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to parse resume';
      if (errorMessage.includes('Neural Parser Offline')) {
         toast.error("Neural Sync Interrupted", {
            description: "Connection to processing core timed out. Retrying...",
            style: { 
              background: '#0a0a0a', 
              border: '1px solid rgba(239, 68, 68, 0.5)', 
              color: 'white',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)'
            },
            icon: <AlertCircle className="h-4 w-4 text-red-400" />
          });
      } else {
         toast.error(errorMessage, {
            style: { background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }
         });
      }
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
        <input type="file" accept=".pdf" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${isParsing ? 'bg-primary/10 animate-pulse' : 'bg-primary/5'}`}>
            {isParsing ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{isParsing ? 'Analyzing Resume...' : 'Upload Resume or LinkedIn PDF'}</h3>
            <p className="text-sm text-muted-foreground">{isParsing ? 'Extracting details...' : 'Drag & drop your PDF file here'}</p>
          </div>
        </div>
      </div>

      {/* Re-sync Portfolio Data — triggers existing parse flow via custom event.
          TODO: wire to existing resume re-parse function when one is exposed. */}
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new CustomEvent('resume:resync'));
          toast.info('Re-sync requested. Re-upload your resume to refresh extracted fields.');
        }}
        className="w-full uppercase tracking-[0.08em] text-[12px] font-semibold text-white bg-[#E8390E] hover:bg-[#d8330b] transition-colors rounded-md py-3"
      >
        Re-sync Portfolio Data
      </button>
    </div>
  );
}
