import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/lib/supabase_v2';
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
import { Check, Copy, ExternalLink, Rocket, Linkedin, Twitter, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { triggerCelebration } from '@/lib/confetti';
import { QRCodeSVG } from 'qrcode.react';
import { usePro } from '@/contexts/ProContext';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Validate slug format
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

  // Determine base identifier (username or user id)
  const identifier = profile?.username || user?.id || '';

  // Generate portfolio URL based on slug
  const portfolioUrl = useMemo(() => {
    if (!user?.id) return '';
    const finalSlug = slug.trim() || 'default';
    return `https://www.foliogen.in/p/${identifier}/${finalSlug}`;
  }, [user?.id, identifier, slug]);

  // Check if profile has minimum required content
  const hasMinimumContent = useMemo(() => {
    return profile?.fullName?.trim() || profile?.headline?.trim();
  }, [profile?.fullName, profile?.headline]);

  const checkSlugAvailability = async (value: string): Promise<boolean> => {
    if (!value.trim()) return true; // Empty is allowed (uses default)

    const normalized = value.toLowerCase().trim();

    if (!isValidSlug(normalized)) {
      setSlugError('Slug must be 3-30 characters, lowercase letters, numbers, hyphens, or underscores only');
      return false;
    }

    setIsCheckingSlug(true);
    setSlugError(null);

    const { data, error } = await supabase
      .from('portfolios')
      .select('user_id')
      .eq('slug', normalized)
      .eq('user_id', user?.id)
      .maybeSingle();

    setIsCheckingSlug(false);

    if (error) {
      setSlugError('Failed to check availability');
      return false;
    }

    // Available if no result for THIS user. Since slug is unique per user, this checks their own namespace
    if (data) {
      setSlugError('You already have a portfolio with this slug');
      return false;
    }

    setSlugError(null);
    return true;
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
      setIsPublishing(false);
      toast({
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Now create/update the portfolio instance in the portfolios table
    // ProfileContext data is ready
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
      hide_photo: profile.hidePhoto
    };

    if (isPro) {
      // Pro: Insert directly (with conflict resolution if they typed an existing slug)
      const { error: portError } = await supabase.from('portfolios').upsert({
        user_id: user.id,
        slug: normalizedSlug,
        template_name: profile.selectedTemplate || 'minimalist',
        data_json: dataJson
      }, { onConflict: 'user_id,slug' });

      if (portError) {
        setIsPublishing(false);
        toast({ title: 'Error', description: 'Failed to deploy identity.', variant: 'destructive' });
        return;
      }
    } else {
      // Free: Overwrite existing logic. Need to find their existing portfolio (if any) and overwrite.
      const { data: existing } = await supabase.from('portfolios').select('id, slug').eq('user_id', user.id).limit(1);

      if (existing && existing.length > 0) {
        // Upsert on their existing slug
        const targetSlug = existing[0].slug;
        const { error: portError } = await supabase.from('portfolios').update({
          template_name: profile.selectedTemplate || 'minimalist',
          data_json: dataJson
        }).eq('id', existing[0].id);

        if (portError) {
          setIsPublishing(false);
          toast({ title: 'Error', description: 'Failed to deploy identity.', variant: 'destructive' });
          return;
        }

        // Ensure the slug input visually updates if we ignored it
        setSlug(targetSlug);
      } else {
        // No existing, insert
        const { error: portError } = await supabase.from('portfolios').insert({
          user_id: user.id,
          slug: normalizedSlug,
          template_name: profile.selectedTemplate || 'minimalist',
          data_json: dataJson
        });

        if (portError) {
          setIsPublishing(false);
          toast({ title: 'Error', description: 'Failed to deploy identity.', variant: 'destructive' });
          return;
        }
      }
    }

    setIsPublishing(false);
    setIsPublished(true);
    triggerCelebration();
    toast({
      title: 'Identity Deployed 🚀',
      description: `Your portfolio is live at https://www.foliogen.in/p/${identifier}/${normalizedSlug}`,
    });
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isPublished ? (
              <>
                <Check className="h-5 w-5 text-emerald-500" />
                Your portfolio is live!
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5" />
                Publish Your Portfolio
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isPublished
              ? 'Share this link with recruiters and hiring managers.'
              : 'Choose a custom username for your portfolio URL.'}
          </DialogDescription>
        </DialogHeader>

        {!isPublished ? (
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Choose a unique URL slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  foliogen.in/p/{identifier}/
                </span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. design-v1"
                  className="flex-1 font-mono"
                  disabled={isPublishing || !isPro}
                />
              </div>
              {!isPro && (
                <p className="text-[11px] text-amber-500 font-medium">
                  Free users are limited to 1 default portfolio. Any publish will overwrite your active identity.
                </p>
              )}
              {slugError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {slugError}
                </p>
              )}
              {!slugError && slug && isPro && (
                <p className="text-sm text-muted-foreground">
                  Leave empty to use 'default'
                </p>
              )}
            </div>

            <Button
              onClick={handlePublish}
              disabled={isPublishing || saving || isCheckingSlug || !!slugError}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
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
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-border inline-block">
              <QRCodeSVG
                value={portfolioUrl}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-sm text-center text-muted-foreground w-full">
              Scan this QR code or copy the link below to share your professional identity.
            </p>

            <div className="flex items-center gap-2 w-full">
              <Input
                value={portfolioUrl}
                readOnly
                className="flex-1 text-sm bg-muted/30 font-medium"
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
            <div className="flex gap-2 w-full mt-2">
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

            <div className="border-t border-border pt-4 mt-2 w-full">
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
