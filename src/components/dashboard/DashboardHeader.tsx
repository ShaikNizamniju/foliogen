import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, FileDown, Share2, Eye } from 'lucide-react';
import { PublishDialog } from './PublishDialog';
import { ShareDialog } from './ShareDialog';
import { ModeToggle } from '@/components/ModeToggle';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import html2pdf from 'html2pdf.js';

export function DashboardHeader() {
  const [publishOpen, setPublishOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { profile } = useProfile();
  const { user } = useAuth();

  // Get the base URL for portfolio
  const getPortfolioUrl = () => {
    const baseUrl = window.location.origin;
    return user ? `${baseUrl}/p/${user.id}` : '';
  };

  const handleDownloadPdf = async () => {
    // Target the ATS-friendly printable resume container
    const element = document.getElementById('printable-resume-container');
    
    if (!element) {
      toast({
        title: "Export Error",
        description: "Could not find resume content to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    toast({
      title: "Generating PDF...",
      description: "Please wait while we create your ATS-friendly resume.",
    });

    const options = {
      margin: 0,
      filename: `${profile.fullName || 'resume'}-resume.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 4, // Ultra-sharp text
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        backgroundColor: '#ffffff',
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf().set(options).from(element).save();
      toast({
        title: "Resume Downloaded!",
        description: "Your ATS-friendly resume has been saved.",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
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
          <Button onClick={() => setShareOpen(true)} variant="outline" size="sm" data-tour="chat">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleDownloadPdf} variant="outline" size="sm" disabled={isExporting} data-tour="pdf">
            <FileDown className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Download PDF'}
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
