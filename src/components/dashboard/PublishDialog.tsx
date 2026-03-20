import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/lib/supabase_v2';
import { generateNextSequentialSlug } from '@/lib/slugEngine';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy, ExternalLink, Rocket, Linkedin, Twitter, Mail, AlertCircle, Loader2, Link2, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { triggerCelebration } from '@/lib/confetti';
import { QRCodeSVG } from 'qrcode.react';
import { usePro } from '@/contexts/ProContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Validate slug format (for Pro custom slugs)
const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9_-]{3,30}$/.test(slug);
};

export function PublishDialog({ open, onOpenChange }: PublishDialogProps) {
  const { user } = useAuth();
  const { isPro } = usePro();
  const { profile, saveProfile, saving } = useProfile();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [slug, setSlug] = useState('');
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [customSlug, setCustomSlug] = useState<string | null>(null);
  const [isLoadingSlug, setIsLoadingSlug] = useState(false);

  // On dialog open, pre-fetch existing custom_slug or generate a preview
  useEffect(() => {
    if (!open || !user?.id) return;

    const loadExistingSlug = async () => {
      setIsLoadingSlug(true);
      const { data: existing } = await supabase
        .from('portfolios')
        .select('custom_slug')
        .eq('user_id', user.id)
        .not('custom_slug', 'is', null)
        .limit(1)
        .maybeSingle();

      if (existing?.custom_slug) {
        setCustomSlug(existing.custom_slug);
      }
      setIsLoadingSlug(false);
    };

    loadExistingSlug();
  }, [open, user?.id]);

  // Generate portfolio URL based on the sequential slug
  const portfolioUrl = useMemo(() => {
    if (customSlug) return `https://www.foliogen.in/u/${customSlug}`;
    return '';
  }, [customSlug]);

  // Check if profile has minimum required content
  const hasMinimumContent = useMemo(() => {
    return profile?.fullName?.trim() || profile?.headline?.trim();
  }, [profile?.fullName, profile?.headline]);

  const checkSlugAvailability = async (value: string): Promise<boolean> => {
    if (!value.trim()) return true;

    const normalized = value.toLowerCase().trim();

    if (!isValidSlug(normalized)) {
      setSlugError('Slug must be 3-30 characters, lowercase letters, numbers, hyphens, or underscores only');
      return false;
    }

    setIsCheckingSlug(true);
    setSlugError(null);

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('user_id')
        .eq('slug', normalized)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error("Slug check error:", error);
        setSlugError('Failed to check availability. Please try again.');
        return false;
      }

      if (data) {
        setSlugError('You already have a portfolio with this slug');
        return false;
      }

      setSlugError(null);
      return true;
    } catch (err) {
      console.error("Slug check exception:", err);
      setSlugError('Connection error while checking slug.');
      return false;
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setSlug(value);
    setSlugError(null);
  };

  const handlePublish = async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'Unable to publish. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check slug availability if provided
      const normalizedSlug = slug.trim().toLowerCase() || 'default';
      if (normalizedSlug !== 'default') {
        const isAvailable = await checkSlugAvailability(normalizedSlug);
        if (!isAvailable) return;
      }

      setIsPublishing(true);

      // First save the profile edits globally
      const { error: saveError } = await saveProfile();

      if (saveError) {
        throw saveError;
      }

    // Build the data payload
    const dataJson = {
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
      hide_photo: profile.hidePhoto,
    };

    let generatedCustomSlug = customSlug;

    // ── Sequential Slug Assignment ──────────────────────────────────────
    // Check if user already has a custom_slug assigned
    const { data: existing } = await supabase
      .from('portfolios')
      .select('id, slug, custom_slug')
      .eq('user_id', user.id)
      .limit(1);

    if (existing && existing.length > 0 && existing[0].custom_slug) {
      // Reuse existing sequential slug
      generatedCustomSlug = existing[0].custom_slug;
    } else {
      // Generate a brand-new sequential slug (a, b, c, … aa, ab, …)
      generatedCustomSlug = await generateNextSequentialSlug();
    }

    setCustomSlug(generatedCustomSlug);

    // ── Upsert portfolio ────────────────────────────────────────────────
    if (isPro) {
      const { error: portError } = await supabase.from('portfolios').upsert({
        user_id: user.id,
        slug: normalizedSlug,
        custom_slug: generatedCustomSlug,
        template_name: profile.selectedTemplate || 'minimalist',
        data_json: dataJson,
      }, { onConflict: 'user_id,slug' });

      if (portError) {
        setIsPublishing(false);
        toast({ title: 'Error', description: 'Failed to deploy identity.', variant: 'destructive' });
        return;
      }
    } else {
      // Free: overwrite existing
      if (existing && existing.length > 0) {
        const { error: portError } = await supabase.from('portfolios').update({
          template_name: profile.selectedTemplate || 'minimalist',
          custom_slug: generatedCustomSlug,
          data_json: dataJson,
        }).eq('id', existing[0].id);

        if (portError) {
          setIsPublishing(false);
          toast({ title: 'Error', description: 'Failed to deploy identity.', variant: 'destructive' });
          return;
        }

        setSlug(existing[0].slug);
      } else {
        const { error: portError } = await supabase.from('portfolios').insert({
          user_id: user.id,
          slug: normalizedSlug,
          custom_slug: generatedCustomSlug,
          template_name: profile.selectedTemplate || 'minimalist',
          data_json: dataJson,
        });

        if (portError) {
          setIsPublishing(false);
          toast({ title: 'Error', description: 'Failed to deploy identity.', variant: 'destructive' });
          return;
        }
      }
    }

      setIsPublished(true);
      triggerCelebration();
      toast({
        title: 'Identity Deployed 🚀',
        description: `Your portfolio is live at foliogen.in/u/${generatedCustomSlug}`,
      });
    } catch (err: any) {
      console.error("Publish error:", err);
      toast({
        title: 'Deployment Failed ❌',
        description: err.message || 'An unexpected error occurred during deployment.',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = async () => {
    if (!portfolioUrl) return;
    await navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Portfolio URL copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPortfolio = () => {
    if (!portfolioUrl) return;
    window.open(portfolioUrl, '_blank');
  };

  const handleShareLinkedIn = () => {
    if (!portfolioUrl) return;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  const handleShareTwitter = () => {
    if (!portfolioUrl) return;
    const displayName = profile?.fullName || 'my';
    const text = `Check out ${displayName}'s professional portfolio! 🚀`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(portfolioUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleShareEmail = () => {
    if (!portfolioUrl) return;
    const displayName = profile?.fullName || 'My';
    const subject = `${displayName}'s Professional Portfolio`;
    const body = `Hi,\n\nI wanted to share my professional portfolio with you:\n\n${portfolioUrl}\n\nLooking forward to connecting!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsPublished(false);
      setSlugError(null);
      setSlug('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-popover/95 backdrop-blur-xl border border-border shadow-xl rounded-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {isPublished ? (
              <>
                <Check className="h-5 w-5 text-emerald-500" />
                Your portfolio is live!
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5 text-primary" />
                Publish Your Portfolio
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isPublished
              ? 'Share this professional link with recruiters and hiring managers.'
              : 'Deploy your portfolio with a unique, professional short URL.'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isPublished ? (
            <motion.div
              key="pre-publish"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-5 py-4"
            >
              {/* ── URL Preview ────────────────────────────────────────── */}
              <div className="bg-muted/50 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Your Professional URL
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-background rounded-lg px-4 py-3 border border-border">
                  <span className="text-sm text-muted-foreground font-mono">foliogen.in/u/</span>
                  {isLoadingSlug ? (
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground font-mono">generating...</span>
                    </div>
                  ) : customSlug ? (
                    <span className="text-sm font-mono font-bold text-primary">{customSlug}</span>
                  ) : (
                    <span className="text-sm font-mono text-muted-foreground italic">
                      auto-assigned on deploy
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Sequential slugs (a, b, c… aa, ab…) are assigned automatically for clean, memorable URLs.
                </p>
              </div>

              {/* ── Pro Custom Slug (optional, for Pro users) ──────────── */}
              {isPro && (
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs font-medium text-muted-foreground">
                    Custom Internal Slug (Pro)
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap font-mono">
                      internal:
                    </span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={handleSlugChange}
                      placeholder="e.g. design-v1"
                      className="flex-1 font-mono text-sm h-9"
                      disabled={isPublishing}
                    />
                  </div>
                  {slugError && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {slugError}
                    </p>
                  )}
                </div>
              )}

              {!isPro && (
                <p className="text-[11px] text-amber-500 font-medium flex items-center gap-1.5 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Free users are limited to 1 portfolio. Any publish will overwrite your active identity.
                </p>
              )}

              <Button
                onClick={handlePublish}
                disabled={isPublishing || saving || isCheckingSlug || !!slugError}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 shadow-glow"
              >
                {isPublishing || saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Publishing...
                  </>
                ) : isCheckingSlug ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Checking availability...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    Deploy Identity
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="post-publish"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-5 py-4"
            >
              {/* ── QR Code ────────────────────────────────────────────── */}
              <div className="bg-white p-3 rounded-xl shadow-sm border border-border inline-block">
                <QRCodeSVG
                  value={portfolioUrl}
                  size={160}
                  level="M"
                  includeMargin={false}
                />
              </div>

              {/* ── Professional URL Highlight ─────────────────────────── */}
              <div className="w-full bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2 font-bold opacity-60">Your Identity is Live!</p>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-mono">Claimed URL:</span>
                  <p className="text-xl font-mono font-bold text-primary tracking-tight">
                    foliogen.in/u/{customSlug}
                  </p>
                </div>
              </div>

              <p className="text-sm text-center text-muted-foreground w-full">
                Scan the QR code or copy the link below to share your professional identity.
              </p>

              {/* ── Copy URL ───────────────────────────────────────────── */}
              <div className="flex items-center gap-2 w-full">
                <Input
                  value={portfolioUrl}
                  readOnly
                  className="flex-1 text-sm bg-muted/30 font-mono font-medium"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex gap-2 w-full mt-1">
                <Button
                  variant="outline"
                  onClick={handleOpenPortfolio}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Portfolio
                </Button>
                <Button onClick={handleCopy} className="flex-1 shadow-glow">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>

              {/* ── Social Share ────────────────────────────────────────── */}
              <div className="border-t border-border pt-4 mt-1 w-full">
                <p className="text-sm text-muted-foreground mb-3">Share on social media</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleShareLinkedIn}
                    className="flex-1 gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShareTwitter}
                    className="flex-1 gap-2"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShareEmail}
                    className="flex-1 gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
