import { useProfile, Project } from '@/contexts/ProfileContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export function ProjectsForm() {
  const { profile, updateProfile } = useProfile();

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
                  <Label>Project Link</Label>
                  <Input
                    placeholder="https://myproject.com"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, { link: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  placeholder="https://example.com/project-screenshot.jpg"
                  value={project.imageUrl}
                  onChange={(e) => updateProject(project.id, { imageUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your project..."
                  rows={3}
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                />
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
