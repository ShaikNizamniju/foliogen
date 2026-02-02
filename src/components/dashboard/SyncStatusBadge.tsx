import { CheckCircle2, CloudOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncStatusBadgeProps {
  source?: 'resume' | 'linkedin' | null;
  syncing?: boolean;
  className?: string;
}

export function SyncStatusBadge({ source, syncing = false, className }: SyncStatusBadgeProps) {
  if (syncing) {
    return (
      <div className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        className
      )}>
        <RefreshCw className="h-3 w-3 animate-spin" />
        Syncing...
      </div>
    );
  }

  if (!source) {
    return (
      <div className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        'bg-muted text-muted-foreground',
        className
      )}>
        <CloudOff className="h-3 w-3" />
        No source data
      </div>
    );
  }

  const sourceLabels: Record<string, string> = {
    resume: 'Resume',
    linkedin: 'LinkedIn',
  };

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      className
    )}>
      <CheckCircle2 className="h-3 w-3" />
      Data synced from {sourceLabels[source]}
    </div>
  );
}
