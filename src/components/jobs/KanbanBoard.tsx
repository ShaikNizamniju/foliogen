import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core';
import { JobApplication, JobStatus, useJobApplications } from '@/hooks/useJobApplications';
import { KanbanColumn } from './KanbanColumn';
import { AddJobDialog } from './AddJobDialog';
import { JobCard } from './JobCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const COLUMNS: { status: JobStatus; title: string; emoji: string }[] = [
  { status: 'saved', title: 'Saved', emoji: '📌' },
  { status: 'applied', title: 'Applied', emoji: '📤' },
  { status: 'interviewing', title: 'Interviewing', emoji: '🎤' },
  { status: 'offer', title: 'Offer', emoji: '🎉' },
  { status: 'rejected', title: 'Rejected', emoji: '❌' },
];

export function KanbanBoard() {
  const {
    jobs,
    loading,
    addJob,
    updateJob,
    updateJobStatus,
    deleteJob,
    getJobsByStatus,
  } = useJobApplications();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [activeJob, setActiveJob] = useState<JobApplication | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const job = jobs.find((j) => j.id === active.id);
    setActiveJob(job || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const jobId = active.id as string;
    const targetStatus = over.id as JobStatus;

    // Check if dropping on a column
    if (COLUMNS.some((col) => col.status === targetStatus)) {
      const job = jobs.find((j) => j.id === jobId);
      if (job && job.status !== targetStatus) {
        await updateJobStatus(jobId, targetStatus);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: handle drag over for visual feedback
  };

  const handleEdit = (job: JobApplication) => {
    setEditingJob(job);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      await deleteJob(id);
    }
  };

  const handleMoveStatus = async (id: string, newStatus: JobStatus) => {
    await updateJobStatus(id, newStatus);
  };

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingJob(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Command Center</h1>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <motion.div 
          className="flex gap-4 overflow-x-auto pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.status}
              status={column.status}
              title={column.title}
              emoji={column.emoji}
              jobs={getJobsByStatus(column.status)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMoveStatus={handleMoveStatus}
            />
          ))}
        </motion.div>

        <DragOverlay>
          {activeJob && (
            <div className="w-[260px]">
              <JobCard
                job={activeJob}
                onEdit={() => {}}
                onDelete={() => {}}
                onMoveStatus={() => {}}
                isDragging
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Add/Edit Dialog */}
      <AddJobDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        onSubmit={addJob}
        onUpdate={updateJob}
        editingJob={editingJob}
      />
    </div>
  );
}
