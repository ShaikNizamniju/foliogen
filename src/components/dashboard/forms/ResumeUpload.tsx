import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const { updateProfile } = useProfile();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + ' ';
    }
    return fullText;
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsParsing(true);
    try {
      toast.info('Extracting text from PDF...');
      const rawText = await extractTextFromPDF(file);

      toast.info('Analyzing with AI...');
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText: rawText }
      });

      if (error) throw error;

      console.log('Parsed Data:', data);

      updateProfile({
        fullName: data.fullName,
        headline: data.headline,
        bio: data.bio,
        location: data.location,
        email: data.email,
        linkedinUrl: data.linkedinUrl,
        skills: data.skills || [],
        workExperience: data.workExperience || [],
        projects: data.projects || []
      });

      toast.success('Resume parsed successfully! Check your profile tabs.');
      
    } catch (error) {
      console.error('Parsing error:', error);
      toast.error('Failed to parse resume. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processFile(files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) processFile(files[0]);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25 hover:border-primary/50'} ${isParsing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${isParsing ? 'bg-primary/10 animate-pulse' : 'bg-primary/5'}`}>
            {isParsing ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isParsing ? 'Analyzing Resume...' : 'Upload your Resume'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {isParsing 
                ? 'Our AI is extracting your skills and experience. This may take a few seconds.' 
                : 'Drag & drop your PDF here, or click to browse. We support PDF files up to 10MB.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
