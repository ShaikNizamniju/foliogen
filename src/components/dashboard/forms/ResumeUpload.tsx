import { useState } from 'react';
import { Upload, Loader2, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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

      if (error) throw new Error("Connection failed: " + error.message);
      if (data.error) throw new Error(data.error);

      // Ensure IDs on work experience and projects
      const safeWorkExperience = (data.workExperience || []).map((w: any) => ({
        ...w,
        id: w.id || crypto.randomUUID(),
      }));
      const safeProjects = (data.projects || []).map((p: any) => ({
        title: p.title || '',
        description: p.description || '',
        link: p.link || '',
        imageUrl: p.imageUrl || '',
        ...p,
        id: p.id || crypto.randomUUID(),
      }));

      const updates = {
        fullName: data.fullName,
        headline: data.headline,
        bio: data.bio,
        location: data.location,
        email: data.email,
        linkedinUrl: data.linkedinUrl,
        skills: data.skills || [],
        workExperience: safeWorkExperience,
        projects: safeProjects,
      };

      updateProfile(updates);

      // Auto-save to database (pass overrides to avoid stale state)
      try {
        const { error: saveError } = await saveProfile(updates);
        if (saveError) {
          toast.success('Resume parsed! Please click "Save Changes" to persist.');
        } else {
          toast.success('Resume parsed & saved!');
        }
      } catch {
        toast.success('Resume parsed! Please save manually.');
      }

    } catch (error: any) {
      toast.error(error?.message || 'Failed to parse resume');
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
    <div className="w-full max-w-xl mx-auto">
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
    </div>
  );
}
