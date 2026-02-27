import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, FileDown, Share2, Eye, Search } from 'lucide-react';
import { PublishDialog } from './PublishDialog';
import { ShareDialog } from './ShareDialog';
import { ModeToggle } from '@/components/ModeToggle';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import html2pdf from 'html2pdf.js';
import { motion } from 'framer-motion';

export function DashboardHeader() {
  const [publishOpen, setPublishOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { profile } = useProfile();
  const { user } = useAuth();

  const getPortfolioUrl = () => {
    const baseUrl = window.location.origin;
    return user ? `${baseUrl}/p/${user.id}` : '';
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('printable-resume-container');
    if (!element) {
      toast({ title: "Export Error", description: "Could not find resume content to export.", variant: "destructive" });
      return;
    }
    setIsExporting(true);
    toast({ title: "Generating PDF...", description: "Please wait while we create your ATS-friendly resume." });
    const options = {
      margin: 0,
      filename: `${profile.fullName || 'resume'}-resume.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 4, useCORS: true, letterRendering: true, scrollY: 0, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    try {
      await html2pdf().set(options).from(element).save();
      toast({ title: "Resume Downloaded!", description: "Your ATS-friendly resume has been saved." });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: "Export Failed", description: "There was an error creating your PDF. Please try again.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <motion.header 
        className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 print:hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Dashboard</h1>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border/50">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium tabular-nums">{profile.views ?? 0}</span>
            <span className="text-xs text-muted-foreground">views</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button onClick={() => setShareOpen(true)} variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground" data-tour="chat">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleDownloadPdf} variant="ghost" size="sm" disabled={isExporting} className="hidden sm:flex text-muted-foreground hover:text-foreground" data-tour="pdf">
            <FileDown className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'PDF'}
          </Button>
          <Button onClick={() => setPublishOpen(true)} size="sm" className="rounded-xl bg-primary hover:bg-primary/90 shadow-sm">
            <Rocket className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </motion.header>
      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} portfolioUrl={getPortfolioUrl()} />
    </>
  );
}
