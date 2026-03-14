import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle,
  Briefcase, GraduationCap, Sparkles, X, ArrowRight, Merge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase_v2';
import { useProfile, WorkExperience, Project, ProfileData } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import * as pdfjsLib from 'pdfjs-dist';
import { getRecommendedTemplate, ProfessionalDomain } from '@/lib/domainRecommendation';

// Dynamically resolve worker URL to match installed pdfjs-dist version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

type ParseState = 'idle' | 'extracting' | 'analyzing' | 'success' | 'error';

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
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [stats, setStats] = useState<ParseStats | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const { profile, updateProfile, saveProfile } = useProfile();
  const { user } = useAuth();

  const resetParser = useCallback(() => {
    setState('idle');
    setProgress(0);
    setParsedData(null);
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

      const truncatedText = fullText.slice(0, 30000);

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText: truncatedText }
      });

      setProgress(80);

      if (error) throw new Error("Neural Sync: Core connection offline. Investigating...");
      if (data?.error) throw new Error(data.error);

      // Step 3: Calculate stats
      const parsedStats: ParseStats = {
        jobs: data.workExperience?.length || 0,
        skills: data.skills?.length || 0,
        projects: data.projects?.length || 0,
        highlights: data.keyHighlights?.length || 0,
      };

      setParsedData(data);
      setStats(parsedStats);
      setState('success');
      setProgress(100);

      // Automatically trigger merge for speed if profile is empty
      const isProfileEmpty = profile.workExperience.length === 0 && profile.skills.length === 0;
      if (isProfileEmpty) {
          setTimeout(() => applyToProfile(data, file), 1000);
      }

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

  const applyToProfile = async (data: ParsedData, file?: File) => {
    if (!data) return;

    toast.loading('Synchronizing profile...', { id: 'resume-apply' });

    // Upload to storage
    let resumeUrl = profile.resumeUrl;
    const fileToUpload = file || currentFile;
    
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
      fullName: data.fullName || profile.fullName,
      headline: data.headline || profile.headline,
      bio: data.bio || profile.bio,
      location: data.location || profile.location,
      email: data.email || profile.email,
      linkedinUrl: data.linkedinUrl || profile.linkedinUrl,
      skills: [...new Set([...profile.skills, ...(data.skills || [])])],
      workExperience: (data.workExperience || []).map(w => ({
        ...w,
        id: crypto.randomUUID(),
        startDate: safeDate(w.startDate),
        endDate: safeDate(w.endDate),
      })),
      projects: (data.projects || []).map(p => ({
        ...p,
        id: crypto.randomUUID(),
        visible: true,
      })),
      keyHighlights: data.keyHighlights || profile.keyHighlights,
      resumeUrl: resumeUrl,
      predictedDomain: data.predictedDomain || profile.predictedDomain,
      selectedTemplate: data.predictedDomain ? getRecommendedTemplate(data.predictedDomain) as any : profile.selectedTemplate,
    };

    const { error } = await saveProfile(updates);
    
    if (error) {
      toast.error('Sync failed: ' + error.message, { id: 'resume-apply' });
    } else {
      toast.success('Neural Sync complete. Dashboard updated.', { id: 'resume-apply' });
      if (onTemplateChange && updates.selectedTemplate) {
        onTemplateChange(updates.selectedTemplate);
      }
      resetParser();
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
                    Supports standard resumes and LinkedIn PDF exports — FolioGen AI maps everything automatically
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
                        {state === 'extracting' ? 'Extracting Identity...' : 'Neural Mapping...'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Uploading and AI is analyzing {fileName}...
                      </p>
                 </div>
            </div>
          </motion.div>
        )}

        {state === 'success' && stats && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-primary/30 rounded-2xl p-8 bg-primary/5"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 rounded-2xl bg-primary/20">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Neural Sync Successful
                </h3>
                <p className="text-sm text-muted-foreground">
                  Extracted {stats.jobs} roles and {stats.skills} core competencies
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  onClick={() => parsedData && applyToProfile(parsedData)}
                  className="flex-1 shadow-glow"
                >
                  <Merge className="w-4 h-4 mr-2" />
                  Apply to Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={resetParser}
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
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
            <h3 className="font-semibold text-foreground mb-2">Neural Sync Interrupted</h3>
            <p className="text-sm text-muted-foreground mb-6">{errorMessage}</p>
            <Button onClick={resetParser} variant="outline">Try Another File</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
