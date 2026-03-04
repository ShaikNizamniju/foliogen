import { useState, useEffect, useRef } from 'react';
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
  FileText,
  Upload,
  Lock,
  LockOpen,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SmartTagInput } from './SmartTagInput';
import { SmartProjectImage } from '@/components/ui/SmartProjectImage';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';
import { ensureProtocol } from '@/lib/urlUtils';
import { supabase } from '@/integrations/supabase/client';

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
  docsUrl: z
    .string()
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://'),
      'URL must start with http:// or https://'
    )
    .optional()
    .or(z.literal('')),
  description: z.string().max(2000, 'Description too long').optional(),
  techStack: z.array(z.string()).default([]),
  targetKeywords: z.array(z.string()).default([]),
  visible: z.boolean().default(true),
  visualPrompt: z.string().optional(),
  isProtected: z.boolean().default(false),
  password: z.string().optional(),
  references: z.array(z.object({
    id: z.string(),
    type: z.enum(['url', 'testimonial']),
    title: z.string(),
    url: z.string().optional(),
    content: z.string().optional(),
    author: z.string().optional(),
  })).default([]),
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  // Handle file upload to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, PNG, or JPG files.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${project.id}-${Date.now()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('project_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project_documents')
        .getPublicUrl(filePath);

      // Auto-fill the docsUrl field
      updateLocalField('docsUrl', publicUrl);

      // Immediate update to parent
      onUpdate(project.id, { docsUrl: publicUrl });

      toast.success('Proof uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid image type. Please upload PNG, JPG, or WEBP.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large. Maximum size is 2MB.');
      return;
    }

    setIsImageUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${project.id}-thumbnail-${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      updateLocalField('imageUrl', publicUrl);
      onUpdate(project.id, { imageUrl: publicUrl });

      toast.success('Project image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsImageUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
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
                    placeholder="https://myproject.com or myproject.com"
                    value={localProject.link}
                    onChange={(e) => updateLocalField('link', e.target.value)}
                    onBlur={(e) => {
                      const sanitized = ensureProtocol(e.target.value);
                      if (sanitized !== e.target.value) {
                        updateLocalField('link', sanitized);
                      }
                    }}
                    className={cn(
                      'pr-10',
                      validationErrors['link'] && 'border-destructive'
                    )}
                  />
                  {localProject.link && !validationErrors['link'] && (
                    <button
                      type="button"
                      onClick={() => window.open(ensureProtocol(localProject.link), '_blank', 'noopener,noreferrer')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      title="Test link in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {validationErrors['link'] && (
                  <p className="text-xs text-destructive">{validationErrors['link']}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  URLs are auto-fixed: "google.com" → "https://google.com"
                </p>
              </div>
            </div>

            {/* Docs URL - Supporting Document / Case Study */}
            <div className="space-y-2">
              <Label htmlFor={`docsUrl-${project.id}`} className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Supporting Document / Case Study
              </Label>
              <div className="relative">
                <Input
                  id={`docsUrl-${project.id}`}
                  placeholder="docs.google.com/... or notion.so/..."
                  value={localProject.docsUrl || ''}
                  onChange={(e) => updateLocalField('docsUrl', e.target.value)}
                  onBlur={(e) => {
                    const sanitized = ensureProtocol(e.target.value);
                    if (sanitized !== e.target.value) {
                      updateLocalField('docsUrl', sanitized);
                    }
                  }}
                  className={cn(
                    'pr-10',
                    validationErrors['docsUrl'] && 'border-destructive'
                  )}
                />
                {localProject.docsUrl && !validationErrors['docsUrl'] && (
                  <button
                    type="button"
                    onClick={() => window.open(ensureProtocol(localProject.docsUrl), '_blank', 'noopener,noreferrer')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Test link in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
              </div>
              {validationErrors['docsUrl'] && (
                <p className="text-xs text-destructive">{validationErrors['docsUrl']}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Link to a case study, PRD, Notion page, or PDF (auto-fixes URLs)
              </p>

              {/* File Upload Option */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <Label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Upload className="h-4 w-4" />
                  Or Upload Proof (PDF / Image)
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isUploading && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Uploading...</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Upload certificates, screenshots, or case study PDFs (max 10MB)
                </p>
              </div>
            </div>

            {/* Image URL with Smart Preview */}
            <div className="space-y-2">
              <Label htmlFor={`imageUrl-${project.id}`}>Thumbnail Image URL</Label>
              <Input
                id={`imageUrl-${project.id}`}
                placeholder="https://example.com/project-screenshot.jpg (leave empty for auto-generated cover)"
                value={localProject.imageUrl}
                onChange={(e) => updateLocalField('imageUrl', e.target.value)}
                className={cn(validationErrors['imageUrl'] && 'border-destructive')}
              />
              {validationErrors['imageUrl'] && (
                <p className="text-xs text-destructive">{validationErrors['imageUrl']}</p>
              )}

              {/* File Upload Option for Project Image */}
              <div className="flex flex-col gap-2 mt-4 mb-4">
                <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  Or Upload Project Image
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={handleImageUpload}
                    disabled={isImageUploading}
                    className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isImageUploading && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Uploading...</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a custom thumbnail for your project (max 2MB, fallback to AI-generated cover if empty).
                </p>
              </div>

              {/* Smart Project Image Preview */}
              <div className="mt-2 w-40 rounded-lg overflow-hidden border border-border">
                <SmartProjectImage
                  title={localProject.title}
                  tags={[...(localProject.techStack || []), ...(localProject.targetKeywords || [])]}
                  customImage={localProject.imageUrl}
                  aspectRatio="video"
                  showRefresh={!localProject.imageUrl}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {localProject.imageUrl
                  ? 'Using custom image'
                  : 'Auto-generated cover based on project title and tags'}
              </p>
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

            {/* References Section */}
            <div className="border-t border-border pt-5 mt-2">
              <div className="flex items-center justify-between mb-3">
                <Label className="font-medium flex items-center gap-2">
                  📎 References & Testimonials
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newRef = {
                      id: crypto.randomUUID(),
                      type: 'url' as const,
                      title: '',
                      url: '',
                    };
                    const currentRefs = localProject.references || [];
                    updateLocalField('references', [...currentRefs, newRef]);
                  }}
                  className="gap-1.5"
                >
                  + Add Reference
                </Button>
              </div>
              {(localProject.references || []).length > 0 && (
                <div className="space-y-3">
                  {(localProject.references || []).map((ref, refIdx) => (
                    <div key={ref.id} className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={ref.type}
                          onChange={(e) => {
                            const refs = [...(localProject.references || [])];
                            refs[refIdx] = { ...refs[refIdx], type: e.target.value as 'url' | 'testimonial' };
                            updateLocalField('references', refs);
                          }}
                          className="text-xs rounded border border-border bg-background px-2 py-1"
                        >
                          <option value="url">External URL</option>
                          <option value="testimonial">Testimonial</option>
                        </select>
                        <Input
                          placeholder="Reference title"
                          value={ref.title}
                          onChange={(e) => {
                            const refs = [...(localProject.references || [])];
                            refs[refIdx] = { ...refs[refIdx], title: e.target.value };
                            updateLocalField('references', refs);
                          }}
                          className="flex-1 h-8 text-sm"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                          onClick={() => {
                            const refs = (localProject.references || []).filter((_, i) => i !== refIdx);
                            updateLocalField('references', refs);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      {ref.type === 'url' ? (
                        <Input
                          placeholder="https://example.com/reference"
                          value={ref.url || ''}
                          onChange={(e) => {
                            const refs = [...(localProject.references || [])];
                            refs[refIdx] = { ...refs[refIdx], url: e.target.value };
                            updateLocalField('references', refs);
                          }}
                          className="h-8 text-sm"
                        />
                      ) : (
                        <>
                          <Textarea
                            placeholder="Write a testimonial or reference quote..."
                            value={ref.content || ''}
                            onChange={(e) => {
                              const refs = [...(localProject.references || [])];
                              refs[refIdx] = { ...refs[refIdx], content: e.target.value };
                              updateLocalField('references', refs);
                            }}
                            rows={2}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Author name"
                            value={ref.author || ''}
                            onChange={(e) => {
                              const refs = [...(localProject.references || [])];
                              refs[refIdx] = { ...refs[refIdx], author: e.target.value };
                              updateLocalField('references', refs);
                            }}
                            className="h-8 text-sm"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {(localProject.references || []).length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Add external links or testimonials to strengthen your project credibility.
                </p>
              )}
            </div>

            {/* Password Protection Section */}
            <div className="border-t border-border pt-5 mt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-medium">🔒 Protect this Project</Label>
                </div>
                <Button
                  type="button"
                  variant={localProject.isProtected ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newProtected = !localProject.isProtected;
                    updateLocalField('isProtected', newProtected);
                    if (!newProtected) {
                      updateLocalField('password', '');
                    }
                    onUpdate(project.id, {
                      isProtected: newProtected,
                      password: newProtected ? localProject.password : ''
                    });
                  }}
                  className="gap-2"
                >
                  {localProject.isProtected ? (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      Protected
                    </>
                  ) : (
                    <>
                      <LockOpen className="h-3.5 w-3.5" />
                      Unprotected
                    </>
                  )}
                </Button>
              </div>

              {localProject.isProtected && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <Label htmlFor={`password-${project.id}`}>Project Password</Label>
                  <Input
                    id={`password-${project.id}`}
                    type="password"
                    placeholder="Set a password for this project..."
                    value={localProject.password || ''}
                    onChange={(e) => updateLocalField('password', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recruiters will need this password to view the project details
                  </p>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
