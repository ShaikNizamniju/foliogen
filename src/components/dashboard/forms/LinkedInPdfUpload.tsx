import { useState } from 'react';
import { Linkedin, Upload, Loader2, HelpCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase_v2';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Dynamically resolve worker URL to match installed pdfjs-dist version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export function LinkedInPdfUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const { updateProfile } = useProfile();

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsParsing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF
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

      toast.info('Analyzing LinkedIn profile with AI...');

      // Call Edge Function (same as resume parser)
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText: fullText }
      });

      if (error) throw new Error("Connection failed: " + error.message);

      // Handle logic errors returned by the function
      if (data.error) {
        throw new Error(data.error);
      }

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

      toast.success('LinkedIn profile imported successfully!');

    } catch (error: any) {
      console.error('Upload Error:', error);
      toast.error(error.message || 'Failed to parse LinkedIn PDF');
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
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Help Instructions */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <Linkedin className="w-5 h-5 text-[#0A66C2] mt-0.5 flex-shrink-0" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">How to export your LinkedIn profile</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>LinkedIn allows you to download your profile as a PDF. This contains your experience, education, and skills.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Go to your LinkedIn Profile</li>
            <li>Click the <strong>"More"</strong> button below your profile photo</li>
            <li>Select <strong>"Save to PDF"</strong></li>
            <li>Upload the downloaded PDF below</li>
          </ol>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
          isDragging ? 'border-[#0A66C2] bg-[#0A66C2]/5' : 'border-muted/25 hover:border-[#0A66C2]/50'
        }`}
      >
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileSelect} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`p-5 rounded-full ${isParsing ? 'bg-[#0A66C2]/20 animate-pulse' : 'bg-[#0A66C2]/10'}`}>
            {isParsing ? (
              <Loader2 className="w-10 h-10 text-[#0A66C2] animate-spin" />
            ) : (
              <Linkedin className="w-10 h-10 text-[#0A66C2]" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              {isParsing ? 'Importing LinkedIn Data...' : 'Import from LinkedIn PDF'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isParsing ? 'Extracting your profile details...' : 'No login required. Export your profile to PDF and drag it here.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
