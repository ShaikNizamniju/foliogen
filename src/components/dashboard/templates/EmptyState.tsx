import { FileUp, Briefcase, FolderKanban, Sparkles, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'name' | 'bio' | 'experience' | 'projects' | 'skills';
  variant?: 'light' | 'dark';
  className?: string;
}

const emptyStateConfig = {
  name: {
    icon: User,
    placeholder: 'Your Name',
    message: 'Add your name to personalize your portfolio',
  },
  bio: {
    icon: User,
    placeholder: 'Tell your story...',
    message: 'Upload your resume to auto-generate your bio',
  },
  experience: {
    icon: Briefcase,
    placeholder: 'Work Experience',
    message: 'Upload your resume to populate this section',
  },
  projects: {
    icon: FolderKanban,
    placeholder: 'Projects',
    message: 'Add projects to showcase your work',
  },
  skills: {
    icon: Sparkles,
    placeholder: 'Skills & Expertise',
    message: 'Upload your resume to extract your skills',
  },
};

export function EmptyState({ type, variant = 'light', className }: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;
  
  const isDark = variant === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'flex flex-col items-center justify-center py-8 px-4 rounded-lg border-2 border-dashed',
        isDark 
          ? 'border-white/20 bg-white/5' 
          : 'border-black/10 bg-black/[0.02]',
        className
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center mb-3',
        isDark ? 'bg-white/10' : 'bg-black/5'
      )}>
        <Icon className={cn('h-6 w-6', isDark ? 'text-white/40' : 'text-black/30')} />
      </div>
      <p className={cn(
        'text-sm font-medium mb-1',
        isDark ? 'text-white/60' : 'text-black/50'
      )}>
        {config.placeholder}
      </p>
      <p className={cn(
        'text-xs text-center max-w-[200px]',
        isDark ? 'text-white/40' : 'text-black/30'
      )}>
        {config.message}
      </p>
      <div className={cn(
        'flex items-center gap-1.5 mt-3 text-xs',
        isDark ? 'text-white/50' : 'text-black/40'
      )}>
        <FileUp className="h-3.5 w-3.5" />
        <span>Upload Resume</span>
      </div>
    </motion.div>
  );
}

// Skeleton line for inline placeholders
export function SkeletonLine({ 
  width = 'w-24', 
  variant = 'light' 
}: { 
  width?: string; 
  variant?: 'light' | 'dark';
}) {
  const isDark = variant === 'dark';
  
  return (
    <div className={cn(
      'h-4 rounded animate-pulse',
      width,
      isDark ? 'bg-white/10' : 'bg-black/10'
    )} />
  );
}
