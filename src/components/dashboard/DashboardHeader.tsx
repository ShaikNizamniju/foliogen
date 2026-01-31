import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, FileDown, Share2, Eye } from 'lucide-react';
import { PublishDialog } from './PublishDialog';
import { ShareDialog } from './ShareDialog';
import { ModeToggle } from '@/components/ModeToggle';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardHeader() {
  const [publishOpen, setPublishOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { profile } = useProfile();
  const { user } = useAuth();

  // Get the base URL for portfolio
  const getPortfolioUrl = () => {
    const baseUrl = window.location.origin;
    return user ? `${baseUrl}/p/${user.id}` : '';
  };

  const handleDownloadPdf = () => {
    // Add a class to body to help with print styling
    document.body.classList.add('printing-portfolio');
    
    toast({
      title: "Preparing PDF...",
      description: "Your portfolio will open in the print dialog.",
    });

    // Small delay to ensure toast shows before print dialog
    setTimeout(() => {
      window.print();
      // Remove class after print dialog closes
      document.body.classList.remove('printing-portfolio');
    }, 100);
  };

  return (
    <>
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          {/* Stats Card */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{profile.views ?? 0}</span>
            <span className="text-xs text-muted-foreground">views</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button onClick={() => setShareOpen(true)} variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleDownloadPdf} variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={() => setPublishOpen(true)} size="sm">
            <Rocket className="h-4 w-4 mr-2" />
            Publish Portfolio
          </Button>
        </div>
      </header>
      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} portfolioUrl={getPortfolioUrl()} />
    </>
  );
}
