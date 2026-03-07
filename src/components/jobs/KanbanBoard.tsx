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
import { JobApplication, JobStatus, AiPrep, useJobApplications } from '@/hooks/useJobApplications';
import { KanbanColumn } from './KanbanColumn';
import { AddJobDialog } from './AddJobDialog';
import { InterviewPrepModal } from './InterviewPrepModal';
import { JobCard } from './JobCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { triggerCelebration } from '@/lib/confetti';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const COLUMNS: { status: JobStatus; title: string; emoji: string }[] = [
  { status: 'saved', title: 'Saved', emoji: '📌' },
  { status: 'applied', title: 'Applied', emoji: '📤' },
  { status: 'interviewing', title: 'Interviewing', emoji: '🎤' },
  { status: 'offer', title: 'Offered', emoji: '🎉' },
  { status: 'rejected', title: 'Rejected', emoji: '❌' },
];

export function KanbanBoard() {
  const {
    jobs,
    loading,
    addJob,
    updateJob,
    updateJobStatus,
    saveAiPrep,
    deleteJob,
    getJobsByStatus,
  } = useJobApplications();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [activeJob, setActiveJob] = useState<JobApplication | null>(null);

  // Interview prep state
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [prepJob, setPrepJob] = useState<JobApplication | null>(null);
  const [generatingPrepId, setGeneratingPrepId] = useState<string | null>(null);

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
        const previousStatus = job.status;
        await updateJobStatus(jobId, targetStatus);

        // 🎉 Celebration when moving to Offer!
        if (targetStatus === 'offer' && previousStatus !== 'offer') {
          triggerCelebration();
          toast.success('🎉 Congratulations on the offer!');
        }
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
    const job = jobs.find((j) => j.id === id);
    const previousStatus = job?.status;

    await updateJobStatus(id, newStatus);

    // 🎉 Celebration when moving to Offer!
    if (newStatus === 'offer' && previousStatus !== 'offer') {
      triggerCelebration();
      toast.success('🎉 Congratulations on the offer!');
    }
  };

  const handlePrepMe = async (job: JobApplication) => {
    // If already has AI prep, just open the modal
    if (job.ai_prep) {
      setPrepJob(job);
      setPrepModalOpen(true);
      return;
    }

    // Generate AI prep
    setGeneratingPrepId(job.id);

    try {
      const { data, error } = await supabase.functions.invoke('generate-interview-prep', {
        body: { company: job.company, role: job.role },
      });

      if (error) {
        console.error('[KanbanBoard] Error generating prep:', error);
        toast.error('Failed to generate interview prep');
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      // Save to database
      const aiPrep: AiPrep = {
        company_summary: data.company_summary,
        likely_questions: data.likely_questions,
        questions_to_ask: data.questions_to_ask,
      };

      await saveAiPrep(job.id, aiPrep);

      // Update local job and open modal
      const updatedJob = { ...job, ai_prep: aiPrep };
      setPrepJob(updatedJob);
      setPrepModalOpen(true);
      toast.success('Interview prep generated!');
    } catch (error) {
      console.error('[KanbanBoard] Error:', error);
      toast.error('Failed to generate interview prep');
    } finally {
      setGeneratingPrepId(null);
    }
  };

  const handleSavePrepNotes = async (notes: string) => {
    if (!prepJob) return;
    await updateJob(prepJob.id, { notes });
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
          <h1 className="text-2xl font-bold text-foreground">Job Command Centre</h1>
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
              onPrepMe={handlePrepMe}
              generatingPrepId={generatingPrepId}
            />
          ))}
        </motion.div>

        <DragOverlay>
          {activeJob && (
            <div className="w-[260px]">
              <JobCard
                job={activeJob}
                onEdit={() => { }}
                onDelete={() => { }}
                onMoveStatus={() => { }}
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

      {/* Interview Prep Modal */}
      {prepJob && (
        <InterviewPrepModal
          open={prepModalOpen}
          onOpenChange={setPrepModalOpen}
          job={prepJob}
          aiPrep={prepJob.ai_prep}
          onSaveNotes={handleSavePrepNotes}
        />
      )}
    </div>
  );
}
