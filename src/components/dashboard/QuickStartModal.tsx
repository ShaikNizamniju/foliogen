import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Linkedin, FileText, Sparkles, Loader2, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface QuickStartModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuickStartModal({ open, onClose }: QuickStartModalProps) {
  const [step, setStep] = useState<'choose' | 'linkedin' | 'resume' | 'processing'>('choose');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { updateProfile } = useProfile();

  const handleLinkedinSubmit = async () => {
    if (!linkedinUrl.trim()) {
      toast.error('Please enter your LinkedIn URL');
      return;
    }
    
    setStep('processing');
    setIsProcessing(true);
    
    try {
      // For now, we'll just save the LinkedIn URL and inform the user
      // In a full implementation, you'd scrape the LinkedIn profile
      updateProfile({ linkedinUrl: linkedinUrl.trim() });
      
      toast.info('LinkedIn URL saved! Upload your LinkedIn PDF export for full profile import.', {
        duration: 5000
      });
      
      setTimeout(() => {
        onClose();
        setStep('choose');
        setIsProcessing(false);
      }, 1500);
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to process LinkedIn');
      setStep('linkedin');
      setIsProcessing(false);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setStep('processing');
    setIsProcessing(true);
    
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

      toast.info('AI is analyzing your profile...');

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText: fullText }
      });

      if (error) throw new Error("Connection failed: " + error.message);
      if (data.error) throw new Error(data.error);

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

      toast.success('Portfolio created! Check your preview →');
      
      setTimeout(() => {
        onClose();
        setStep('choose');
        setIsProcessing(false);
      }, 1000);

    } catch (error: any) {
      console.error('Upload Error:', error);
      toast.error(error.message || 'Failed to parse file');
      setStep('choose');
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { 
    e.preventDefault(); 
    setIsDragging(true); 
  };
  
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); 
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-card border-border">
        <AnimatePresence mode="wait">
          {step === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8"
            >
              <div className="text-center mb-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Build Your Portfolio</h2>
                <p className="text-muted-foreground">
                  Import your profile in seconds with AI
                </p>
              </div>

              <div className="grid gap-4">
                {/* Resume/LinkedIn PDF Upload */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 bg-muted/30'
                  }`}
                >
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileSelect} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Drop Resume or LinkedIn PDF</h3>
                      <p className="text-sm text-muted-foreground">
                        AI extracts your info automatically
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </motion.div>

                {/* LinkedIn URL Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('linkedin')}
                  className="p-6 rounded-xl border border-border bg-muted/30 hover:border-primary/50 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#0A66C2]/10">
                      <Linkedin className="h-6 w-6 text-[#0A66C2]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Paste LinkedIn URL</h3>
                      <p className="text-sm text-muted-foreground">
                        Quick setup with your profile link
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </motion.button>

                {/* Skip Option */}
                <button
                  onClick={onClose}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                  I'll fill it manually →
                </button>
              </div>
            </motion.div>
          )}

          {step === 'linkedin' && (
            <motion.div
              key="linkedin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <button
                onClick={() => setStep('choose')}
                className="absolute top-4 left-4 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </button>

              <div className="text-center mb-6 pt-4">
                <div className="w-14 h-14 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center mx-auto mb-4">
                  <Linkedin className="h-7 w-7 text-[#0A66C2]" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">Enter LinkedIn URL</h2>
                <p className="text-sm text-muted-foreground">
                  We'll save your profile link
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/yourname"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="h-12"
                />
                <Button 
                  onClick={handleLinkedinSubmit} 
                  className="w-full h-12"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  For full import, use "Export as PDF" from LinkedIn
                </p>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground mb-2">Creating Your Portfolio</h2>
              <p className="text-muted-foreground">
                AI is analyzing and building your professional story...
              </p>
              <div className="mt-6 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
