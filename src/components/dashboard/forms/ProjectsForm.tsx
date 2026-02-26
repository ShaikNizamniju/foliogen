import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMutation } from '@tanstack/react-query';
import { useProfile, Project } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { SmartProjectCard, SmartProject, projectSchema } from './SmartProjectCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Json } from '@/integrations/supabase/types';

const ENHANCE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enhance-project`;

// Convert old Project format to SmartProject
function toSmartProject(project: Project): SmartProject {
  return {
    id: project.id,
    title: project.title || '',
    link: project.link || '',
    imageUrl: project.imageUrl || '',
    description: project.description || '',
    techStack: (project as any).techStack || [],
    targetKeywords: (project as any).targetKeywords || [],
    visible: (project as any).visible !== false,
    visualPrompt: project.visualPrompt,
    references: project.references || [],
  };
}

// Convert SmartProject back to Profile Project format
function toProfileProject(project: SmartProject): Project {
  return {
    id: project.id,
    title: project.title,
    link: project.link || '',
    imageUrl: project.imageUrl || '',
    description: project.description || '',
    visualPrompt: project.visualPrompt,
    techStack: project.techStack,
    targetKeywords: project.targetKeywords,
    visible: project.visible,
    references: project.references,
  } as Project;
}

export function ProjectsForm() {
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const [enhancingIds, setEnhancingIds] = useState<Set<string>>(new Set());
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());

  // Convert profile projects to SmartProjects
  const smartProjects = useMemo(
    () => profile.projects.map(toSmartProject),
    [profile.projects]
  );

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Save mutation using react-query
  const saveMutation = useMutation({
    mutationFn: async (projects: SmartProject[]) => {
      if (!user) throw new Error('Not authenticated');

      const profileProjects = projects.map(toProfileProject);

      const { error } = await supabase
        .from('profiles')
        .update({
          projects: profileProjects as unknown as Json,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      return projects;
    },
    onSuccess: () => {
      // Update local profile state
      const profileProjects = smartProjects.map(toProfileProject);
      updateProfile({ projects: profileProjects });
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error('Failed to save projects');
    },
  });

  // Add new project
  const addProject = () => {
    const newProject: SmartProject = {
      id: crypto.randomUUID(),
      title: '',
      link: '',
      imageUrl: '',
      description: '',
      techStack: [],
      targetKeywords: [],
      visible: true,
    };
    const updatedProjects = [...smartProjects, newProject];
    updateProfile({ projects: updatedProjects.map(toProfileProject) });
  };

  // Update project with debounced save status tracking
  const updateProject = useCallback(
    (id: string, updates: Partial<SmartProject>) => {
      // Clear any previous states
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setErrorIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      // Set saving state
      setSavingIds((prev) => new Set(prev).add(id));

      // Update local state
      const updatedProjects = smartProjects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj
      );
      updateProfile({ projects: updatedProjects.map(toProfileProject) });

      // Trigger save
      saveMutation.mutate(updatedProjects, {
        onSuccess: () => {
          setSavingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          setSavedIds((prev) => new Set(prev).add(id));
          // Clear saved indicator after 2 seconds
          setTimeout(() => {
            setSavedIds((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }, 2000);
        },
        onError: () => {
          setSavingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          setErrorIds((prev) => new Set(prev).add(id));
        },
      });
    },
    [smartProjects, saveMutation, updateProfile]
  );

  // Remove project
  const removeProject = useCallback(
    (id: string) => {
      const updatedProjects = smartProjects.filter((proj) => proj.id !== id);
      updateProfile({ projects: updatedProjects.map(toProfileProject) });
      saveMutation.mutate(updatedProjects);
      toast.success('Project removed');
    },
    [smartProjects, saveMutation, updateProfile]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = smartProjects.findIndex((p) => p.id === active.id);
        const newIndex = smartProjects.findIndex((p) => p.id === over.id);

        const reorderedProjects = arrayMove(smartProjects, oldIndex, newIndex);
        updateProfile({ projects: reorderedProjects.map(toProfileProject) });
        saveMutation.mutate(reorderedProjects);
      }
    },
    [smartProjects, saveMutation, updateProfile]
  );

  // Enhance with AI
  const enhanceWithAI = async (project: SmartProject) => {
    if (!project.description?.trim()) {
      toast.error('Please add some description or bullet points first');
      return;
    }

    setEnhancingIds((prev) => new Set(prev).add(project.id));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to enhance projects');
        setEnhancingIds((prev) => { const next = new Set(prev); next.delete(project.id); return next; });
        return;
      }

      const response = await fetch(ENHANCE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          description: project.description,
          title: project.title,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to enhance description');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let enhancedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              enhancedContent += content;
              updateProject(project.id, { description: enhancedContent });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Handle remaining buffer
      if (buffer.trim()) {
        for (let raw of buffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              enhancedContent += content;
              updateProject(project.id, { description: enhancedContent });
            }
          } catch {}
        }
      }

      toast.success('Description enhanced successfully!');
    } catch (error) {
      console.error('Enhance error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to enhance description');
    } finally {
      setEnhancingIds((prev) => {
        const next = new Set(prev);
        next.delete(project.id);
        return next;
      });
    }
  };

  // Get save status for a project
  const getSaveStatus = (id: string): 'idle' | 'saving' | 'saved' | 'error' => {
    if (savingIds.has(id)) return 'saving';
    if (savedIds.has(id)) return 'saved';
    if (errorIds.has(id)) return 'error';
    return 'idle';
  };

  return (
    <div className="space-y-6">
      {smartProjects.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/30">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Add your projects to showcase your work. Tag them with keywords for Job Match optimization.
          </p>
          <Button onClick={addProject} variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={smartProjects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {smartProjects.map((project, index) => (
                  <SmartProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onUpdate={updateProject}
                    onRemove={removeProject}
                    onEnhance={enhanceWithAI}
                    isEnhancing={enhancingIds.has(project.id)}
                    saveStatus={getSaveStatus(project.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Button onClick={addProject} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Project
          </Button>
        </>
      )}
    </div>
  );
}
