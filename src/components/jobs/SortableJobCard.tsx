import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { JobApplication, JobStatus } from '@/hooks/useJobApplications';
import { JobCard } from './JobCard';

interface SortableJobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onMoveStatus: (id: string, newStatus: JobStatus) => void;
  onPrepMe?: (job: JobApplication) => void;
  isGeneratingPrep?: boolean;
}

export function SortableJobCard({ 
  job, 
  onEdit, 
  onDelete, 
  onMoveStatus,
  onPrepMe,
  isGeneratingPrep,
}: SortableJobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <JobCard
        job={job}
        onEdit={onEdit}
        onDelete={onDelete}
        onMoveStatus={onMoveStatus}
        onPrepMe={onPrepMe}
        isGeneratingPrep={isGeneratingPrep}
        isDragging={isDragging}
      />
    </div>
  );
}
