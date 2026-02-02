import { useState } from 'react';
import { useProfile, Project } from '@/contexts/ProfileContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectImageCard } from '../ProjectImageCard';

const ENHANCE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enhance-project`;

export function ProjectsForm() {
  const { profile, updateProfile } = useProfile();
  const [enhancingIds, setEnhancingIds] = useState<Set<string>>(new Set());

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: '',
      link: '',
      imageUrl: '',
      description: '',
    };
    updateProfile({ projects: [...profile.projects, newProject] });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    updateProfile({
      projects: profile.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj
      ),
    });
  };

  const removeProject = (id: string) => {
    updateProfile({
      projects: profile.projects.filter((proj) => proj.id !== id),
    });
  };

  const enhanceWithAI = async (project: Project) => {
    if (!project.description?.trim()) {
      toast.error('Please add some description or bullet points first');
      return;
    }

    setEnhancingIds((prev) => new Set(prev).add(project.id));

    try {
      const response = await fetch(ENHANCE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
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

  return (
    <div className="space-y-6">
      {profile.projects.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">No projects added yet</p>
          <Button onClick={addProject} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      ) : (
        <>
          {profile.projects.map((project, index) => (
            <div key={project.id} className="p-4 border border-border rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Project #{index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Project Image Card with Unsplash */}
              <ProjectImageCard 
                project={project}
                onImageChange={(imageUrl) => updateProject(project.id, { imageUrl })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input
                    placeholder="My Awesome Project"
                    value={project.title}
                    onChange={(e) => updateProject(project.id, { title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Project Link / Demo URL</Label>
                  <Input
                    placeholder="https://myproject.com or YouTube/Loom link"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, { link: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    YouTube and Loom links will auto-embed as videos
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Description</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => enhanceWithAI(project)}
                    disabled={enhancingIds.has(project.id)}
                    className="gap-1.5"
                  >
                    {enhancingIds.has(project.id) ? (
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
                  placeholder="Describe your project... (bullet points work too!)"
                  rows={4}
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Add rough notes and click "Enhance with AI" to rewrite using the STAR method
                </p>
              </div>
            </div>
          ))}

          <Button onClick={addProject} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Project
          </Button>
        </>
      )}
    </div>
  );
}
