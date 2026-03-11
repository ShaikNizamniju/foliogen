import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, FileDown, Share2, Eye, Copy, Check } from 'lucide-react';
import { PublishDialog } from './PublishDialog';
import { ShareModal } from './ShareModal';
import { ModeToggle } from '@/components/ModeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { PersonaSwitcher } from './PersonaSwitcher';

import { motion } from 'framer-motion';

export function DashboardHeader() {
  const [publishOpen, setPublishOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { profile } = useProfile();
  const { user } = useAuth();

  const getPublicUrl = () => {
    const baseUrl = "https://www.foliogen.in";
    const slug = profile.username || user?.id;
    return slug ? `${baseUrl}/u/${slug}` : '';
  };

  const getPortfolioUrl = () => {
    const baseUrl = "https://www.foliogen.in";
    return user ? `${baseUrl}/p/${user.id}` : '';
  };

  const handleCopyLink = async () => {
    const url = getPublicUrl();
    if (!url) {
      toast({ title: "No link available", description: "Publish your portfolio first to get a shareable link.", variant: "destructive" });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Link copied!", description: url });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('printable-resume-container');
    if (!element) {
      toast({ title: "Export Error", description: "Could not find resume content to export.", variant: "destructive" });
      return;
    }

    setIsExporting(true);
    toast({ title: "Preparing print view...", description: "Use your browser's Save as PDF option to export your resume." });

    try {
      window.print();
      toast({ title: "Print dialog opened", description: "Select Save as PDF to complete your export." });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: "Export Failed", description: "There was an error opening print dialog. Please try again.", variant: "destructive" });
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
          <SidebarTrigger className="md:hidden mr-2" />
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Dashboard</h1>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border/50">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium tabular-nums">{profile.views ?? 0}</span>
            <span className="text-xs text-muted-foreground">views</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PersonaSwitcher />
          <ModeToggle />
          <Button onClick={handleCopyLink} variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground gap-1.5">
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
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
      <ShareModal open={shareOpen} onOpenChange={setShareOpen} defaultUrl={getPortfolioUrl()} />
    </>
  );
}
