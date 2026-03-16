import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle,
  Briefcase, GraduationCap, Sparkles, ArrowRight, Merge, Save, Trash2,
  GitMerge, Replace
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase_v2';
import { useProfile, WorkExperience, Project, ProfileData, Persona, NarrativeVariant } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import * as pdfjsLib from 'pdfjs-dist';
import { getRecommendedTemplate, ProfessionalDomain } from '@/lib/domainRecommendation';
import { cn } from '@/lib/utils';

// Dynamically resolve worker URL to match installed pdfjs-dist version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

type ParseState = 'idle' | 'extracting' | 'analyzing' | 'reviewing' | 'success' | 'error';

interface ParsedData {
  fullName?: string;
  headline?: string;
  bio?: string;
  location?: string;
  email?: string;
  linkedinUrl?: string;
  skills?: string[];
  workExperience?: WorkExperience[];
  projects?: Project[];
  keyHighlights?: string[];
  predictedDomain?: ProfessionalDomain;
  profileStrength?: number;
  narrativeVariants?: Record<Persona, NarrativeVariant>;
}

interface ParseStats {
  jobs: number;
  skills: number;
  projects: number;
  highlights: number;
}

interface SmartResumeParserProps {
  onTemplateChange?: (templateId: string) => void;
}

export function SmartResumeParser({ onTemplateChange }: SmartResumeParserProps = {}) {
  const [state, setState] = useState<ParseState>('idle');
  const [progress, setProgress] = useState(0);
  const [pendingData, setPendingData] = useState<ParsedData | null>(null);
  const [stats, setStats] = useState<ParseStats | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [mergeConfirmOpen, setMergeConfirmOpen] = useState(false);
  const [applyMode, setApplyMode] = useState<'merge' | 'replace'>('replace');

  const { profile, updateProfile, saveProfile } = useProfile();
  const { user } = useAuth();

  // Restore state from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('foliogen_pending_parse');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPendingData(parsed);
        setState('reviewing');
        // If we recover, show a subtle hint
        toast.info("Resuming your previous resume review session.", { duration: 3000 });
      } catch (e) {
        sessionStorage.removeItem('foliogen_pending_parse');
      }
    }
  }, []);

  // Persist review data to sessionStorage
  useEffect(() => {
    if (state === 'reviewing' && pendingData) {
      sessionStorage.setItem('foliogen_pending_parse', JSON.stringify(pendingData));
    } else if (state === 'idle' || state === 'success' || state === 'error') {
      sessionStorage.removeItem('foliogen_pending_parse');
    }
  }, [state, pendingData]);

  // Handle background finish notification
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state === 'reviewing') {
        const wasInBackground = sessionStorage.getItem('foliogen_parse_background');
        if (wasInBackground === 'true') {
          toast.success("Analysis complete! Review your profile below.", { icon: <Sparkles className="w-4 h-4 text-primary" /> });
          sessionStorage.removeItem('foliogen_parse_background');
        }
      }
    };

    if ((state === 'analyzing' || state === 'extracting') && document.hidden) {
      sessionStorage.setItem('foliogen_parse_background', 'true');
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state]);

  const resetParser = useCallback(() => {
    setState('idle');
    setProgress(0);
    setPendingData(null);
    setStats(null);
    setFileName('');
    setErrorMessage('');
    setCurrentFile(null);
  }, []);

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
       toast.error('Invalid Format', { description: 'Please upload a PDF file.' });
       return;
    }

    if (file.size > 10 * 1024 * 1024) {
       toast.error('File Too Large', { description: 'Maximum file size is 10MB.' });
       return;
    }

    setFileName(file.name);
    setCurrentFile(file);
    setState('extracting');
    setProgress(10);
    setErrorMessage('');

    try {
      // Step 1: Extract text from PDF
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setProgress(30);

      let fullText = '';
      const totalPages = pdf.numPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
        setProgress(30 + Math.floor((i / totalPages) * 20));
      }

      if (!fullText || fullText.trim().length < 50) {
        throw new Error("PDF appears to be an image scan. Please use a text-based PDF.");
      }

      // Step 2: Analyze with AI
      setState('analyzing');
      setProgress(55);

      const truncatedText = fullText.slice(0, 15000);

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText: truncatedText }
      });

      setProgress(80);

      if (error) throw new Error("Synchronization interrupted: Core mapping offline.");
      if (data?.error) throw new Error(data.error);

      // Step 3: Prepare for Review
      const parsedStats: ParseStats = {
        jobs: data.workExperience?.length || 0,
        skills: data.skills?.length || 0,
        projects: data.projects?.length || 0,
        highlights: data.keyHighlights?.length || 0,
      };

      setPendingData(data);
      setStats(parsedStats);
      setState('reviewing');
      setProgress(100);

    } catch (error: any) {
      console.error("Parse Error:", error);
      setState('error');
      const msg = error?.message || 'Failed to parse resume';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  const handleApplySync = async (finalData: ParsedData) => {
    if (!finalData) return;

    // Check for conflicts before applying
    const hasConflicts = finalData.workExperience?.some(newW => 
      profile.workExperience.some(oldW => 
        oldW.company.toLowerCase() === newW.company.toLowerCase() && 
        oldW.jobTitle.toLowerCase() === newW.jobTitle.toLowerCase()
      )
    );

    if (hasConflicts && applyMode === 'replace' && !mergeConfirmOpen) {
      setMergeConfirmOpen(true);
      return;
    }

    setIsApplying(true);
    const toastId = 'resume-apply';
    toast.loading('Synchronizing professional data...', { id: toastId });

    try {
      // Upload to storage if needed
      let resumeUrl = profile.resumeUrl;
      const fileToUpload = currentFile;
      
      if (fileToUpload && user) {
        const fileExt = fileToUpload.name.split('.').pop();
        const filePath = `${user.id}/resume-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, fileToUpload, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
          resumeUrl = urlData.publicUrl;
        }
      }

      const safeDate = (d: any): string => {
        if (!d || typeof d !== 'string') return '';
        try {
          const date = new Date(d.trim());
          if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
        } catch (e) { }
        return d.trim();
      };

      const updates: Partial<ProfileData> = {
        fullName: finalData.fullName || profile.fullName,
        headline: finalData.headline || profile.headline,
        bio: finalData.bio || profile.bio,
        location: finalData.location || profile.location,
        email: finalData.email || profile.email,
        linkedinUrl: finalData.linkedinUrl || profile.linkedinUrl,
        skills: [...new Set([...profile.skills, ...(finalData.skills || [])])],
        workExperience: applyMode === 'merge' 
          ? [...profile.workExperience, ...(finalData.workExperience || []).filter(newW => 
              !profile.workExperience.some(oldW => 
                oldW.company.toLowerCase() === newW.company.toLowerCase() && 
                oldW.jobTitle.toLowerCase() === newW.jobTitle.toLowerCase()
              )
            ).map(w => ({
              ...w,
              id: crypto.randomUUID(),
              startDate: safeDate(w.startDate),
              endDate: safeDate(w.endDate),
            }))]
          : (finalData.workExperience || []).map(w => ({
              ...w,
              id: crypto.randomUUID(),
              startDate: safeDate(w.startDate),
              endDate: safeDate(w.endDate),
            })),
        projects: (finalData.projects || []).map(p => ({
          ...p,
          id: crypto.randomUUID(),
          visible: true,
        })),
        keyHighlights: finalData.keyHighlights || profile.keyHighlights,
        resumeUrl: resumeUrl,
        predictedDomain: finalData.predictedDomain || profile.predictedDomain,
        selectedTemplate: finalData.predictedDomain ? getRecommendedTemplate(finalData.predictedDomain) as any : profile.selectedTemplate,
        narrativeVariants: finalData.narrativeVariants || profile.narrativeVariants,
        activePersona: profile.activePersona,
      };

      const { error } = await saveProfile(updates);
      
      if (error) {
        toast.error('Sync failed: ' + error.message, { id: toastId });
      } else {
        // ENSURE TOAST DISMISSAL/REPLACEMENT IS INSTANT
        toast.success('Professional data synchronized.', { id: toastId });
        
        if (onTemplateChange && updates.selectedTemplate) {
          onTemplateChange(updates.selectedTemplate);
        }
        
        // Immediate UI Reset
        sessionStorage.removeItem('foliogen_pending_parse');
        resetParser();
        setState('success');
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sync profile", { id: toastId });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <div
            {...getRootProps()}
            className={cn(
               "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden",
               isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30"
            )}
          >
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, scale: isDragActive ? 1.02 : 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-5">
                <motion.div
                  className={cn("p-5 rounded-2xl transition-colors", isDragActive ? "bg-primary/20" : "bg-primary/10")}
                >
                  <UploadCloud className={cn("w-10 h-10", isDragActive ? "text-primary" : "text-primary/70")} />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Drop your Resume or LinkedIn PDF
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    FolioGen AI extracts your experience and transforms it into a premium narrative.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>PDF files only • Max 10MB</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {(state === 'extracting' || state === 'analyzing') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative border border-border rounded-2xl p-10 bg-card overflow-hidden text-center"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-muted">
                 <motion.div 
                    className="h-full bg-primary" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                 />
            </div>
            
            <div className="flex flex-col items-center gap-6">
                 <Loader2 className="w-12 h-12 text-primary animate-spin" />
                 <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {state === 'extracting' ? 'Extracting Identity...' : 'Analyzing Professional Narrative...'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Processing {fileName}... This usually takes 5-10 seconds.
                      </p>
                 </div>
            </div>
          </motion.div>
        )}

        {state === 'success' && stats && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-emerald-500/20 rounded-2xl p-8 bg-emerald-500/5 text-center"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 rounded-full bg-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Import Complete
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your portfolio has been synchronized with your latest experience.
                </p>
              </div>

              <Button
                onClick={resetParser}
                variant="outline"
                className="w-full"
              >
                Upload Another
              </Button>
            </div>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-destructive/20 rounded-2xl p-8 bg-destructive/5 text-center"
          >
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Processing Interrupted</h3>
            <p className="text-sm text-muted-foreground mb-6">{errorMessage}</p>
            <Button onClick={resetParser} variant="outline">Try Another File</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review & Confirm UI */}
      {state === 'reviewing' && pendingData && (
        <ReviewAndConfirm 
          data={pendingData} 
          isApplying={isApplying}
          onApply={handleApplySync} 
          onDiscard={resetParser} 
        />
      )}

      {/* Merge Confirmation Dialog */}
      <Dialog open={mergeConfirmOpen} onOpenChange={setMergeConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Matching Data Detected</DialogTitle>
            <DialogDescription>
              We found roles that match your existing portfolio. How would you like to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              className="flex-1 gap-2 bg-primary hover:bg-primary/90 shadow-glow"
              onClick={() => {
                setApplyMode('merge');
                if (pendingData) handleApplySync(pendingData);
                setMergeConfirmOpen(false);
              }}
            >
              <GitMerge className="h-4 w-4" />
              Merge (Append New Roles Only)
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => {
                setApplyMode('replace');
                if (pendingData) handleApplySync(pendingData);
                setMergeConfirmOpen(false);
              }}
            >
              <Replace className="h-4 w-4" />
              Update (Replace Matching Roles)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ReviewAndConfirmProps {
  data: ParsedData;
  isApplying: boolean;
  onApply: (data: ParsedData) => void;
  onDiscard: () => void;
}

function ReviewAndConfirm({ data, isApplying, onApply, onDiscard }: ReviewAndConfirmProps) {
  const [editedData, setEditedData] = useState<ParsedData>({
    ...data,
    // Initialize bio/headline from 'general' variant if present
    bio: data.narrativeVariants?.general?.bio || data.bio || '',
    headline: data.narrativeVariants?.general?.headline || data.headline || '',
    projects: data.projects?.slice(0, 3) || [] // Show top 3 as per requirement
  });

  const handleChange = (field: keyof ParsedData, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    setEditedData(prev => {
      const newProjects = [...(prev.projects || [])];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prev, projects: newProjects };
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Verify Your Professional Identity
          </DialogTitle>
          <DialogDescription>
            Our AI has extracted the following narrative. Please verify and edit details before applying to your live dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <Input 
                value={editedData.fullName || ''} 
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Name extracted from resume"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Headline</label>
              <Input 
                value={editedData.headline || ''} 
                onChange={(e) => handleChange('headline', e.target.value)}
                placeholder="A compelling professional headline"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Professional Bio</label>
              <Textarea 
                value={editedData.bio || ''} 
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Your professional summary"
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Top 3 Projects */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2 border-b border-border pb-2">
               Top Case Studies (Extracted)
            </h4>
            <div className="grid gap-4">
              {editedData.projects?.map((project, idx) => (
                <Card key={idx} className="border-border/50 bg-muted/30">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Project #{idx + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <Input 
                      value={project.title || ''} 
                      onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                      placeholder="Project Title"
                      className="font-medium bg-background"
                    />
                    <Textarea 
                      value={project.description || ''} 
                      onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                      placeholder="Project achievements and metrics"
                      className="text-xs bg-background h-20"
                    />
                  </CardContent>
                </Card>
              ))}
              {(!editedData.projects || editedData.projects.length === 0) && (
                <p className="text-xs text-muted-foreground italic text-center py-4">
                  No separate projects detected. Experience will be imported to your resume section.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 sticky bottom-0 bg-background pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            onClick={onDiscard}
            disabled={isApplying}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Discard Import
          </Button>
          <Button 
            onClick={() => onApply(editedData)}
            disabled={isApplying}
            className="shadow-glow bg-primary hover:bg-primary/90 min-w-[140px]"
          >
            {isApplying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Merge className="h-4 w-4 mr-2" />
                Sync to Portfolio
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
