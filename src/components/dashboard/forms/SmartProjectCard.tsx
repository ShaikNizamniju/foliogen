import { useState, useEffect, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { z } from 'zod';
import {
  GripVertical,
  ChevronDown,
  Eye,
  EyeOff,
  Trash2,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SmartTagInput } from './SmartTagInput';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

// Zod schema for project validation
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  link: z
    .string()
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://'),
      'URL must start with http:// or https://'
    )
    .optional()
    .or(z.literal('')),
  imageUrl: z
    .string()
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://'),
      'Image URL must start with http:// or https://'
    )
    .optional()
    .or(z.literal('')),
  description: z.string().max(2000, 'Description too long').optional(),
  techStack: z.array(z.string()).default([]),
  targetKeywords: z.array(z.string()).default([]),
  visible: z.boolean().default(true),
  visualPrompt: z.string().optional(),
});

export type SmartProject = z.infer<typeof projectSchema>;

interface SmartProjectCardProps {
  project: SmartProject;
  index: number;
  onUpdate: (id: string, updates: Partial<SmartProject>) => void;
  onRemove: (id: string) => void;
  onEnhance: (project: SmartProject) => void;
  isEnhancing: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

export function SmartProjectCard({
  project,
  index,
  onUpdate,
  onRemove,
  onEnhance,
  isEnhancing,
  saveStatus,
}: SmartProjectCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [localProject, setLocalProject] = useState(project);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Debounce local changes
  const debouncedProject = useDebounce(localProject, 1000);

  // Sortable hook for drag-and-drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Sync with parent when debounced value changes
  useEffect(() => {
    if (debouncedProject !== project) {
      // Validate before updating
      const result = projectSchema.safeParse(debouncedProject);
      if (result.success) {
        setValidationErrors({});
        onUpdate(project.id, debouncedProject);
      } else {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);
      }
    }
  }, [debouncedProject]);

  // Sync local state when project prop changes (from external updates like AI enhance)
  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  const updateLocalField = <K extends keyof SmartProject>(
    field: K,
    value: SmartProject[K]
  ) => {
    setLocalProject((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVisibility = () => {
    const newVisible = !localProject.visible;
    setLocalProject((prev) => ({ ...prev, visible: newVisible }));
    // Immediate update for visibility toggle
    onUpdate(project.id, { visible: newVisible });
  };

  const StatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">Saving...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-1.5 text-primary">
            <Check className="h-3.5 w-3.5" />
            <span className="text-xs">Saved</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />
            <span className="text-xs">Error</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border border-border rounded-xl bg-card transition-all',
        isDragging && 'opacity-50 shadow-2xl ring-2 ring-primary/50',
        !localProject.visible && 'opacity-60'
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Card Header */}
        <div className="flex items-center gap-2 p-4 border-b border-border">
          {/* Drag Handle */}
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Project Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                #{index + 1}
              </span>
              <h3 className="font-medium truncate">
                {localProject.title || 'Untitled Project'}
              </h3>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="hidden sm:block">
            <StatusIndicator />
          </div>

          {/* Visibility Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleVisibility}
            className={cn(
              'shrink-0',
              localProject.visible
                ? 'text-foreground'
                : 'text-muted-foreground'
            )}
            title={localProject.visible ? 'Hide from portfolio' : 'Show on portfolio'}
          >
            {localProject.visible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>

          {/* Delete Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(project.id)}
            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Collapse Toggle */}
          <CollapsibleTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="shrink-0">
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        {/* Card Body */}
        <CollapsibleContent>
          <div className="p-4 space-y-5">
            {/* Basic Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${project.id}`}>Project Title *</Label>
                <Input
                  id={`title-${project.id}`}
                  placeholder="My Awesome Project"
                  value={localProject.title}
                  onChange={(e) => updateLocalField('title', e.target.value)}
                  className={cn(validationErrors['title'] && 'border-destructive')}
                />
                {validationErrors['title'] && (
                  <p className="text-xs text-destructive">{validationErrors['title']}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`link-${project.id}`}>Project Link / Demo URL</Label>
                <div className="relative">
                  <Input
                    id={`link-${project.id}`}
                    placeholder="https://myproject.com"
                    value={localProject.link}
                    onChange={(e) => updateLocalField('link', e.target.value)}
                    className={cn(
                      'pr-10',
                      validationErrors['link'] && 'border-destructive'
                    )}
                  />
                  {localProject.link && !validationErrors['link'] && (
                    <a
                      href={localProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {validationErrors['link'] && (
                  <p className="text-xs text-destructive">{validationErrors['link']}</p>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor={`imageUrl-${project.id}`}>Thumbnail Image URL</Label>
              <Input
                id={`imageUrl-${project.id}`}
                placeholder="https://example.com/project-screenshot.jpg"
                value={localProject.imageUrl}
                onChange={(e) => updateLocalField('imageUrl', e.target.value)}
                className={cn(validationErrors['imageUrl'] && 'border-destructive')}
              />
              {validationErrors['imageUrl'] && (
                <p className="text-xs text-destructive">{validationErrors['imageUrl']}</p>
              )}
              {localProject.imageUrl && !validationErrors['imageUrl'] && (
                <div className="mt-2 w-24 h-16 rounded-md overflow-hidden bg-muted">
                  <img
                    src={localProject.imageUrl}
                    alt="Project thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description with AI Enhance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`description-${project.id}`}>Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEnhance(localProject)}
                  disabled={isEnhancing || !localProject.description?.trim()}
                  className="gap-1.5"
                >
                  {isEnhancing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Enhance with AI
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id={`description-${project.id}`}
                placeholder="Describe your project... (bullet points work too!)"
                rows={4}
                value={localProject.description}
                onChange={(e) => updateLocalField('description', e.target.value)}
                className={cn(validationErrors['description'] && 'border-destructive')}
              />
              {validationErrors['description'] && (
                <p className="text-xs text-destructive">{validationErrors['description']}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Tip: Add rough notes and click "Enhance with AI" to rewrite using the STAR method
              </p>
            </div>

            {/* Smart Tags Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Tech Stack Tags */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Tech Stack
                </Label>
                <SmartTagInput
                  tags={localProject.techStack || []}
                  onChange={(tags) => updateLocalField('techStack', tags)}
                  placeholder="React, Python, AI..."
                  variant="tech"
                />
              </div>

              {/* Target Keywords Tags */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-foreground" />
                  Target Keywords
                </Label>
                <SmartTagInput
                  tags={localProject.targetKeywords || []}
                  onChange={(tags) => updateLocalField('targetKeywords', tags)}
                  placeholder="FinTech, Healthcare, Startup..."
                  variant="keyword"
                />
                <p className="text-xs text-muted-foreground">
                  Job Match will highlight this project when these keywords match
                </p>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
