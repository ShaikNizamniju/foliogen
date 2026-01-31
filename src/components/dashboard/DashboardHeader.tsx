import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, FileDown } from 'lucide-react';
import { PublishDialog } from './PublishDialog';

export function DashboardHeader() {
  const [publishOpen, setPublishOpen] = useState(false);

  const handleDownloadPdf = () => {
    // Placeholder - PDF download logic will be wired up later
    console.log('Download PDF clicked');
  };

  return (
    <>
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
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
