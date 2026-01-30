import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { PublishDialog } from './PublishDialog';

export function DashboardHeader() {
  const [publishOpen, setPublishOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <Button onClick={() => setPublishOpen(true)} size="sm">
          <Rocket className="h-4 w-4 mr-2" />
          Publish Portfolio
        </Button>
      </header>
      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
    </>
  );
}
