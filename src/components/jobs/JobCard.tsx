import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, ExternalLink, ChevronLeft, ChevronRight, GripVertical, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { JobApplication, JobStatus, AiPrep } from '@/hooks/useJobApplications';
import { motion } from 'framer-motion';

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onMoveStatus: (id: string, newStatus: JobStatus) => void;
  onPrepMe?: (job: JobApplication) => void;
  isGeneratingPrep?: boolean;
  isDragging?: boolean;
}

const STATUS_ORDER: JobStatus[] = ['saved', 'applied', 'interviewing', 'offer', 'rejected'];

export function JobCard({ 
  job, 
  onEdit, 
  onDelete, 
  onMoveStatus, 
  onPrepMe,
  isGeneratingPrep,
  isDragging 
}: JobCardProps) {
  const currentIndex = STATUS_ORDER.indexOf(job.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < STATUS_ORDER.length - 1;
  const isInterviewing = job.status === 'interviewing';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.8 : 1, y: 0, scale: isDragging ? 1.02 : 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          <h4 className="font-semibold text-foreground truncate">{job.company}</h4>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(job)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {job.job_url && (
              <DropdownMenuItem asChild>
                <a href={job.job_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(job.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Role */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.role}</p>

      {/* Salary & AI Prep Badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {job.salary_range && (
          <Badge variant="secondary" className="text-xs">
            {job.salary_range}
          </Badge>
        )}
        {job.ai_prep && (
          <Badge variant="outline" className="text-xs bg-violet-500/10 text-violet-600 border-violet-500/20">
            ✨ Prepped
          </Badge>
        )}
      </div>

      {/* Prep Me Button - Only for Interviewing status */}
      {isInterviewing && onPrepMe && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-3"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20 border-violet-500/30 text-violet-600 hover:text-violet-700"
            onClick={() => onPrepMe(job)}
            disabled={isGeneratingPrep}
          >
            {isGeneratingPrep ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : job.ai_prep ? (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                View Prep
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                ✨ Prep Me
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Move buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={!canMoveLeft}
          onClick={() => canMoveLeft && onMoveStatus(job.id, STATUS_ORDER[currentIndex - 1])}
        >
          <ChevronLeft className="h-3 w-3 mr-1" />
          Move
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={!canMoveRight}
          onClick={() => canMoveRight && onMoveStatus(job.id, STATUS_ORDER[currentIndex + 1])}
        >
          Move
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}
