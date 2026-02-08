import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { JobApplication, JobStatus } from '@/hooks/useJobApplications';
import { SortableJobCard } from './SortableJobCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: JobStatus;
  title: string;
  emoji: string;
  jobs: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onMoveStatus: (id: string, newStatus: JobStatus) => void;
  onPrepMe?: (job: JobApplication) => void;
  generatingPrepId?: string | null;
}

const COLUMN_COLORS: Record<JobStatus, string> = {
  saved: 'border-t-slate-400',
  applied: 'border-t-blue-500',
  interviewing: 'border-t-amber-500',
  offer: 'border-t-emerald-500',
  rejected: 'border-t-red-400',
};

export function KanbanColumn({
  status,
  title,
  emoji,
  jobs,
  onEdit,
  onDelete,
  onMoveStatus,
  onPrepMe,
  generatingPrepId,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col min-w-[280px] w-[280px] bg-muted/30 rounded-xl border border-border/50 border-t-4 transition-colors',
        COLUMN_COLORS[status],
        isOver && 'bg-muted/60 ring-2 ring-primary/20'
      )}
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span>{emoji}</span>
            {title}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {jobs.length}
          </Badge>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 pt-0 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <SortableJobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveStatus={onMoveStatus}
              onPrepMe={status === 'interviewing' ? onPrepMe : undefined}
              isGeneratingPrep={generatingPrepId === job.id}
            />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            No jobs here
          </div>
        )}
      </div>
    </div>
  );
}
