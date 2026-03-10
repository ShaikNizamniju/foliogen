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

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Validate username format
const isValidUsername = (username: string): boolean => {
  return /^[a-z0-9_-]{3,30}$/.test(username);
};

export function PublishDialog({ open, onOpenChange }: PublishDialogProps) {
  const { user } = useAuth();
  const { profile, saveProfile, saving } = useProfile();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Generate portfolio URL based on username or user ID
  const portfolioUrl = useMemo(() => {
    if (!user?.id) return '';
    const slug = username.trim() || user.id;
    return `https://www.foliogen.in/p/${slug}`;
  }, [user?.id, username]);

  // Check if profile has minimum required content
  const hasMinimumContent = useMemo(() => {
    return profile?.fullName?.trim() || profile?.headline?.trim();
  }, [profile?.fullName, profile?.headline]);

  const checkUsernameAvailability = async (value: string): Promise<boolean> => {
    if (!value.trim()) return true; // Empty is allowed (uses user ID)

    const normalized = value.toLowerCase().trim();

    if (!isValidUsername(normalized)) {
      setUsernameError('Username must be 3-30 characters, lowercase letters, numbers, hyphens, or underscores only');
      return false;
    }

    setIsCheckingUsername(true);
    setUsernameError(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('username', normalized)
      .maybeSingle();

    setIsCheckingUsername(false);

    if (error) {
      setUsernameError('Failed to check availability');
      return false;
    }

    // Available if no result OR if it's the current user's username
    if (data && data.user_id !== user?.id) {
      setUsernameError('This username is already taken');
      return false;
    }

    setUsernameError(null);
    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(value);
    setUsernameError(null);
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

    // Check username availability if provided
    const normalizedUsername = username.trim().toLowerCase();
    if (normalizedUsername) {
      const isAvailable = await checkUsernameAvailability(normalizedUsername);
      if (!isAvailable) return;
    }

    setIsPublishing(true);

    // Update username in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username: normalizedUsername || null
      })
      .eq('user_id', user.id);

    if (updateError) {
      setIsPublishing(false);
      toast({
        title: 'Error',
        description: updateError.message.includes('unique')
          ? 'This username is already taken'
          : 'Failed to save username. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Save profile
    const { error } = await saveProfile();
    setIsPublishing(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish portfolio. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsPublished(true);
    triggerCelebration();
    toast({
      title: 'Portfolio published! 🚀',
      description: normalizedUsername
        ? `Your portfolio is live at https://www.foliogen.in/p/${normalizedUsername}`
        : 'Your portfolio is now live and shareable.',
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
      setUsernameError(null);
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
              <Label htmlFor="username">Choose your unique link</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  foliogen.in/p/
                </span>
                <Input
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="yourname"
                  className="flex-1"
                  disabled={isPublishing}
                />
              </div>
              {usernameError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {usernameError}
                </p>
              )}
              {!usernameError && username && (
                <p className="text-sm text-muted-foreground">
                  Leave empty to use your default ID-based link
                </p>
              )}
            </div>

            <Button
              onClick={handlePublish}
              disabled={isPublishing || saving || isCheckingUsername || !!usernameError}
              className="w-full"
            >
              {isPublishing || saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Publishing...
                </>
              ) : isCheckingUsername ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Checking availability...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Publish Portfolio
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
