import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, FileDown } from 'lucide-react';
import { PublishDialog } from './PublishDialog';
import { ModeToggle } from '@/components/ModeToggle';
import { toast } from '@/hooks/use-toast';

export function DashboardHeader() {
  const [publishOpen, setPublishOpen] = useState(false);

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
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
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
    </>
  );
}
