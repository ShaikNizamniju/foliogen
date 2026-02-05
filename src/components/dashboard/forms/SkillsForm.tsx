import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

export function SkillsForm() {
  const { profile, updateProfile } = useProfile();
  const [newSkill, setNewSkill] = useState('');

  // SAFETY: Use optional chaining for safe array access
  const skills = profile.skills ?? [];

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      updateProfile({ skills: [...skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    // SAFETY: Use optional chaining with fallback
    updateProfile({ skills: skills.filter((s) => s !== skill) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill (e.g., React, TypeScript, UI Design)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={addSkill} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">
            No skills added yet. Type a skill and press Enter.
          </p>
        </div>
      )}

      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Add 5-10 relevant skills that showcase your expertise.
          Be specific — "React" is better than "JavaScript frameworks."
        </p>
      </div>
    </div>
  );
}
