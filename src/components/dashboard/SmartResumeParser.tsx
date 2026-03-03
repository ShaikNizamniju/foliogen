import { useState, useCallback } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle, 
  Briefcase, GraduationCap, Sparkles, X, ArrowRight, Merge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useProfile, WorkExperience, Project } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import * as pdfjsLib from 'pdfjs-dist';
import { getRecommendedTemplate, ProfessionalDomain } from '@/lib/domainRecommendation';

// Use CDNJS URL matching installed pdfjs-dist version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`;

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
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();

  const resetParser = useCallback(() => {
    setState('idle');
    setProgress(0);
    setParsedData(null);
    setStats(null);
    setFileName('');
    setErrorMessage('');
    setUploadedResumeUrl('');
    setCurrentFile(null);
  }, []);

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
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

      // Truncate for stability (as per memory)
      const truncatedText = fullText.slice(0, 30000);

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText: truncatedText }
      });

      setProgress(80);

      if (error) throw new Error("AI analysis failed: " + error.message);
      if (data.error) throw new Error(data.error);

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

    } catch (error: any) {
      console.error('Parse Error:', error);
      setState('error');
      setErrorMessage(error.message || 'Failed to parse resume');
      toast.error(error.message || 'Failed to parse resume');
    }
  };

  const applyToProfile = useCallback(async (mergeSkills: boolean = true) => {
    if (!parsedData) return;

    // Upload the resume file to storage if we have one
    let resumeUrl = profile.resumeUrl;
    if (currentFile && user) {
      try {
        const fileExt = currentFile.name.split('.').pop();
        const filePath = `${user.id}/resume-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, currentFile, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath);
          
          resumeUrl = urlData.publicUrl;
          setUploadedResumeUrl(resumeUrl);
        }
      } catch (err) {
        console.error('Resume upload error:', err);
        // Continue without uploading - parsing still works
      }
    }

    // Merge skills if requested
    let finalSkills = parsedData.skills || [];
    if (mergeSkills && profile.skills.length > 0) {
      const existingSet = new Set(profile.skills.map(s => s.toLowerCase()));
      const newSkills = finalSkills.filter(s => !existingSet.has(s.toLowerCase()));
      finalSkills = [...profile.skills, ...newSkills];
    }

    // Determine template: use AI-predicted domain or fallback to modern-dark
    const domain = parsedData.predictedDomain as ProfessionalDomain | undefined;
    const recommendedTemplate = domain ? getRecommendedTemplate(domain) : 'modern-dark';

    // Save domain to localStorage for gallery recommendations
    if (domain) {
      localStorage.setItem('foliogen_domain', domain);
    }

    updateProfile({
      fullName: parsedData.fullName || profile.fullName,
      headline: parsedData.headline || profile.headline,
      bio: parsedData.bio || profile.bio,
      location: parsedData.location || profile.location,
      email: parsedData.email || profile.email,
      linkedinUrl: parsedData.linkedinUrl || profile.linkedinUrl,
      skills: finalSkills,
      workExperience: parsedData.workExperience || profile.workExperience,
      projects: parsedData.projects || profile.projects,
      keyHighlights: parsedData.keyHighlights || profile.keyHighlights,
      resumeUrl: resumeUrl,
      selectedTemplate: recommendedTemplate as typeof profile.selectedTemplate,
    });

    if (onTemplateChange) {
      onTemplateChange(recommendedTemplate);
    }

    // Scroll to the preview section
    setTimeout(() => {
      const previewSection = document.querySelector('[data-template-preview]');
      if (previewSection) {
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    toast.success('Profile updated successfully!');
    resetParser();
  }, [parsedData, profile, updateProfile, resetParser, onTemplateChange, currentFile, user]);

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => { 
    e.preventDefault(); 
    setIsDragging(true); 
  };
  
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Idle State */}
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors duration-300
                ${isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30'
                }
              `}
            >
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileSelect} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="flex flex-col items-center gap-5">
                <motion.div 
                  className={`p-5 rounded-2xl transition-colors duration-300 ${isDragging ? 'bg-primary/20' : 'bg-primary/10'}`}
                  animate={isDragging ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <UploadCloud className={`w-10 h-10 transition-colors ${isDragging ? 'text-primary' : 'text-primary/70'}`} />
                </motion.div>
                <div className="space-y-2">
                   <h3 className="text-xl font-semibold text-foreground">
                     Drop your Resume or LinkedIn PDF
                   </h3>
                   <p className="text-sm text-muted-foreground max-w-md">
                     Supports standard resumes and LinkedIn PDF exports — AI maps everything automatically
                   </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>PDF files only • Max 10MB</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Processing State */}
        {(state === 'extracting' || state === 'analyzing') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative border border-border rounded-2xl p-8 bg-card overflow-hidden"
          >
            {/* Laser Scan Effect - Only during analyzing */}
            {state === 'analyzing' && (
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                initial={{ top: '0%' }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
              />
            )}
            
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="relative">
                <motion.div 
                  className="p-5 rounded-2xl bg-primary/10"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(59,130,246,0)',
                      '0 0 20px 5px rgba(59,130,246,0.3)',
                      '0 0 0 0 rgba(59,130,246,0)',
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </motion.div>
                <motion.div 
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-card border border-border"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.div>
              </div>
              
              <div className="text-center space-y-2">
                <motion.h3 
                  className="text-lg font-semibold text-foreground"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {state === 'extracting' ? 'Reading your resume...' : 'Brainstorming your portfolio...'}
                </motion.h3>
                <p className="text-sm text-muted-foreground">
                  {fileName && <span className="font-medium">{fileName}</span>}
                </p>
              </div>

              <div className="w-full max-w-sm space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{state === 'extracting' ? 'Extracting text' : 'AI analysis'}</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {state === 'success' && stats && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="border border-primary/30 rounded-2xl p-8 bg-primary/5"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 rounded-2xl bg-primary/20">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Resume analyzed successfully!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Here's what we found in your resume
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border">
                  <Briefcase className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-bold text-foreground">{stats.jobs}</span>
                  <span className="text-xs text-muted-foreground">Jobs</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border">
                  <Sparkles className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-bold text-foreground">{stats.skills}</span>
                  <span className="text-xs text-muted-foreground">Skills</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border">
                  <FileText className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-bold text-foreground">{stats.projects}</span>
                  <span className="text-xs text-muted-foreground">Projects</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border">
                  <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-bold text-foreground">{stats.highlights}</span>
                  <span className="text-xs text-muted-foreground">Highlights</span>
                </div>
              </div>

              {/* Preview of extracted skills */}
              {parsedData?.skills && parsedData.skills.length > 0 && (
                <div className="w-full space-y-2">
                  <p className="text-sm font-medium text-foreground">Skills found:</p>
                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills.slice(0, 8).map((skill, idx) => (
                      <Badge key={idx} variant="secondary">{skill}</Badge>
                    ))}
                    {parsedData.skills.length > 8 && (
                      <Badge variant="outline">+{parsedData.skills.length - 8} more</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button 
                  onClick={() => applyToProfile(true)}
                  className="flex-1 shadow-glow"
                >
                  <Merge className="w-4 h-4 mr-2" />
                  Merge with Profile
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => applyToProfile(false)}
                  className="flex-1"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Replace Profile
                </Button>
                <Button 
                  variant="ghost"
                  onClick={resetParser}
                  size="icon"
                  className="shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="border border-destructive/30 rounded-2xl p-8 bg-destructive/5"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 rounded-2xl bg-destructive/20">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Failed to parse resume
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {errorMessage || 'Something went wrong. Please try again with a different file.'}
                </p>
              </div>

              <Button onClick={resetParser} variant="outline">
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
