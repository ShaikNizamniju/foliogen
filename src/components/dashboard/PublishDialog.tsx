import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, ExternalLink, Rocket, Linkedin, Twitter, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PublishDialog({ open, onOpenChange }: PublishDialogProps) {
  const { user } = useAuth();
  const { saveProfile, saving } = useProfile();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const portfolioUrl = user ? `${window.location.origin}/p/${user.id}` : '';

  const handlePublish = async () => {
    setIsPublishing(true);
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
    toast({
      title: 'Portfolio published!',
      description: 'Your portfolio is now live and shareable.',
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Portfolio URL copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPortfolio = () => {
    window.open(portfolioUrl, '_blank');
  };

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  const handleShareTwitter = () => {
    const text = `Check out my professional portfolio! 🚀`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(portfolioUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleShareEmail = () => {
    const subject = `My Professional Portfolio`;
    const body = `Hi,\n\nI wanted to share my professional portfolio with you:\n\n${portfolioUrl}\n\nLooking forward to connecting!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isPublished ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
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
              : 'Save your latest changes and get a shareable link.'}
          </DialogDescription>
        </DialogHeader>

        {!isPublished ? (
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Publishing will save your current profile and make it viewable at a unique URL.
            </p>
            <Button
              onClick={handlePublish}
              disabled={isPublishing || saving}
              className="w-full"
            >
              {isPublishing || saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Publishing...
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
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                value={portfolioUrl}
                readOnly
                className="flex-1 text-sm"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleOpenPortfolio}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Portfolio
              </Button>
              <Button onClick={handleCopy} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>

            <div className="border-t border-border pt-4 mt-2">
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
