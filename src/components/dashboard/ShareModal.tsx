import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { nanoid } from 'nanoid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Download, Check, Link, Activity, Globe, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase_v2';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultUrl: string; // the fallback main portfolio URL
}

export function ShareModal({ open, onOpenChange, defaultUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chameleonUrl, setChameleonUrl] = useState<string>('');
  const qrRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  const { user } = useAuth();

  const currentIndustry = localStorage.getItem("foliogen_target_industry") || "none";
  const displayIndustry = currentIndustry === 'none' ? 'General Fit' : currentIndustry.replace('_', ' ').toUpperCase();

  // Reset chameleon URL when modal is opened to encourage generating a fresh context link
  useEffect(() => {
    if (open) {
      setChameleonUrl('');
      setCopied(false);
    }
  }, [open, currentIndustry]);

  const generateChameleonLink = async () => {
    if (!user) {
      toast.error('You must be logged in to generate a Chameleon Link', {
        style: { background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }
      });
      return;
    }

    setIsGenerating(true);
    try {
      const slugId = nanoid(10);
      const newUrl = `https://www.foliogen.in/p/${slugId}`;
      
      const payloadData = {
        full_name: profile.fullName,
        photo_url: profile.photoUrl,
        bio: profile.bio,
        headline: profile.headline,
        location: profile.location,
        email: profile.email,
        website: profile.website,
        linkedin_url: profile.linkedinUrl,
        github_url: profile.githubUrl,
        twitter_url: profile.twitterUrl,
        work_experience: profile.workExperience,
        projects: profile.projects,
        skills: profile.skills,
        key_highlights: profile.keyHighlights,
        calendly_url: profile.calendlyUrl,
        resume_url: profile.resumeUrl,
        selected_font: profile.selectedFont,
        hide_photo: profile.hidePhoto
      };

      const { error } = await supabase.from('chameleon_links').insert({
        user_id: user.id,
        slug: slugId,
        industry_context: currentIndustry,
        data_json: payloadData,
        template_name: profile.selectedTemplate || 'modern-dark',
      });

      if (error) throw error;
      
      setChameleonUrl(newUrl);
      
      toast.success(`Chameleon Link ready for ${displayIndustry}`, {
        icon: <Sparkles className="h-4 w-4 text-blue-400" />,
        style: { background: '#0a0a0a', border: '1px solid rgba(59,130,246,0.3)', color: 'white' },
      });

    } catch (e: any) {

      toast.error('Failed to generate context link', {
        style: { background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyUrl = async () => {
    const targetUrl = chameleonUrl || defaultUrl;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      
      // Custom Noir Toast as requested
      toast.success("Link copied to clipboard", {
        description: targetUrl,
        style: { 
          background: '#0a0a0a', 
          border: '1px solid rgba(59, 130, 246, 0.5)', 
          color: 'white',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)'
        },
        icon: <Check className="h-4 w-4 text-blue-400" />
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy', {
        style: { background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }
      });
    }
  };

  const activeUrl = chameleonUrl || defaultUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-popover/95 backdrop-blur-xl border border-border shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Share Portfolio
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Generate an industry-specific URL with targeted tracking analytics.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex flex-col pt-2">
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-300 font-medium">Context: {displayIndustry}</span>
              {!chameleonUrl && (
                <Button 
                  size="sm" 
                  onClick={generateChameleonLink} 
                  disabled={isGenerating}
                  className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 h-8"
                >
                  {isGenerating ? <Activity className="h-4 w-4 animate-spin mr-2" /> : <Link className="h-4 w-4 mr-2" />}
                  Generate Chameleon Link
                </Button>
              )}
            </div>

            <div className="flex gap-2 relative">
              <Input 
                readOnly 
                value={activeUrl} 
                className={cn(
                  "font-mono text-xs bg-black/50 border-white/10 focus-visible:ring-0 text-neutral-300",
                  copied ? "border-blue-500/50 text-blue-400 transition-colors" : ""
                )}
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyUrl}
                className={cn(
                  "shrink-0 bg-transparent border-white/10 hover:bg-white/5 transition-all text-neutral-400",
                  copied ? "bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : ""
                )}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
            {chameleonUrl && (
               <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest flex items-center gap-1 font-mono">
                 <Activity className="h-3 w-3" /> Live Tracking Active
               </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
