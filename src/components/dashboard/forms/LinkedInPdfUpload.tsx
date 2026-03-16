import { useState } from 'react';
import { Linkedin, Upload, Loader2, HelpCircle, GitMerge, Replace } from 'lucide-react';
import { supabase } from '@/lib/supabase_v2';
import { useProfile, ProfileData } from '@/contexts/ProfileContext';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Dynamically resolve worker URL to match installed pdfjs-dist version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export function LinkedInPdfUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<ProfileData> | null>(null);
  const { profile, updateProfile, saveProfile } = useProfile();

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

      toast.info('Analyzing LinkedIn profile with AI...');

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText: fullText }
      });

      if (error) throw new Error("Connection failed: " + error.message);
      if (data.error) throw new Error(data.error);

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

      const parsed: Partial<ProfileData> = {
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

      // DIFF LOGIC: Identify "What's New"
      const existingExpIds = new Set(profile.workExperience.map(w => `${w.company.toLowerCase()}-${w.jobTitle.toLowerCase()}`));
      const newExp = (safeWorkExperience || []).filter((w: any) => !existingExpIds.has(`${w.company.toLowerCase()}-${w.jobTitle.toLowerCase()}`));
      
      const existingSkills = new Set(profile.skills.map(s => s.toLowerCase()));
      const newSkills = (data.skills || []).filter((s: string) => !existingSkills.has(s.toLowerCase()));

      const existingProjTitles = new Set(profile.projects.map(p => p.title.toLowerCase()));
      const newProj = (safeProjects || []).filter((p: any) => !existingProjTitles.has(p.title.toLowerCase()));

      const hasDiff = newExp.length > 0 || newSkills.length > 0 || newProj.length > 0;

      if (hasDiff) {
        setPendingData(parsed);
        setMergeModalOpen(true);
        
        // Detailed Toast Notification
        if (newExp.length > 0) {
          toast(`We found a new role at ${newExp[0].company}!`, {
            description: "Would you like to add it to your Startup and Big Tech personas?",
            icon: <Linkedin className="h-4 w-4 text-[#0A66C2]" />,
          });
        } else if (newSkills.length > 0) {
          toast(`New skills detected!`, {
            description: `${newSkills.slice(0, 3).join(', ')}${newSkills.length > 3 ? '...' : ''} added to your arsenal.`,
          });
        }
      } else {
        toast.info("Your portfolio is already up to date with this LinkedIn profile.");
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to parse LinkedIn PDF');
    } finally {
      setIsParsing(false);
    }
  };

  const applyData = async (data: Partial<ProfileData>, mode: 'merge' | 'replace' | 'append') => {
    if (mode === 'replace') {
      updateProfile(data);
      toast.success('LinkedIn profile imported — previous data replaced.');
    } else {
      // Merge/Append Logic
      const mergedSkills = [...new Set([...(profile.skills || []), ...(data.skills || [])])];
      
      const existingExpIds = new Set(profile.workExperience.map(w => `${w.company.toLowerCase()}-${w.jobTitle.toLowerCase()}`));
      const newExp = (data.workExperience || []).filter(w => !existingExpIds.has(`${w.company.toLowerCase()}-${w.jobTitle.toLowerCase()}`));
      
      const existingProjTitles = new Set(profile.projects.map(p => p.title.toLowerCase()));
      const newProj = (data.projects || []).filter(p => !existingProjTitles.has(p.title.toLowerCase()));

      // Recalculate newSkills for toast in applyData
      const existingSkills = new Set(profile.skills.map(s => s.toLowerCase()));
      const newSkills = (data.skills || []).filter((s: string) => !existingSkills.has(s.toLowerCase()));

      if (mode === 'append') {
        updateProfile({
          skills: mergedSkills,
          workExperience: [...profile.workExperience, ...newExp],
          projects: [...profile.projects, ...newProj],
        });
        toast.success(`Appended ${newExp.length} roles and ${newSkills.length} skills to your portfolio.`);
      } else {
        // Full Merge
        updateProfile({
          fullName: data.fullName || profile.fullName,
          headline: data.headline || profile.headline,
          bio: data.bio || profile.bio,
          location: data.location || profile.location,
          email: data.email || profile.email,
          linkedinUrl: data.linkedinUrl || profile.linkedinUrl,
          skills: mergedSkills,
          workExperience: [...profile.workExperience, ...newExp],
          projects: [...profile.projects, ...newProj],
        });
        toast.success('LinkedIn data merged with your portfolio!');
      }
    }
    setMergeModalOpen(false);
    setPendingData(null);
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

      {/* Merge / Replace Modal */}
      <Dialog open={mergeModalOpen} onOpenChange={setMergeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">LinkedIn Import Detected</DialogTitle>
            <DialogDescription>
              You already have portfolio data. Would you like to merge the LinkedIn data with your current portfolio, or replace it entirely?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              className="flex-1 gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90 shadow-glow"
              onClick={() => pendingData && applyData(pendingData, 'append')}
            >
              <GitMerge className="h-4 w-4" />
              Append New Only (Evergreen)
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => pendingData && applyData(pendingData, 'merge')}
              >
                <GitMerge className="h-4 w-4" />
                Full Merge
              </Button>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => pendingData && applyData(pendingData, 'replace')}
              >
                <Replace className="h-4 w-4" />
                Replace All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
