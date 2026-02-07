import { useProfile, WorkExperience } from '@/contexts/ProfileContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';

export function WorkExperienceForm() {
  const { profile, updateProfile } = useProfile();

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    updateProfile({ workExperience: [...profile.workExperience, newExp] });
  };

  const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
    updateProfile({
      workExperience: profile.workExperience.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    updateProfile({
      workExperience: profile.workExperience.filter((exp) => exp.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {profile.workExperience.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">No work experience added yet</p>
          <Button onClick={addExperience} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>
      ) : (
        <>
          {profile.workExperience.map((exp, index) => (
            <div key={exp.id} className="p-4 border border-border rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Experience #{index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    placeholder="Senior Software Engineer"
                    value={exp.jobTitle}
                    onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Google"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    placeholder="Jan 2020"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    placeholder="Dec 2023"
                    value={exp.endDate}
                    disabled={exp.current}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2 pt-7">
                  <Switch
                    checked={exp.current}
                    onCheckedChange={(checked) => updateExperience(exp.id, { current: checked })}
                  />
                  <Label className="text-sm">Current Role</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                />
              </div>
            </div>
          ))}

          <Button onClick={addExperience} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Experience
          </Button>
        </>
      )}
    </div>
  );
}
