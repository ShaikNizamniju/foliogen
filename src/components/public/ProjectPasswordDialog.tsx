import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { Project } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';

interface ProjectPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  profileUserId: string;
  onUnlock: () => void;
}

export function ProjectPasswordDialog({
  open,
  onOpenChange,
  project,
  profileUserId,
  onUnlock,
}: ProjectPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setChecking(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('verify-project-password', {
        body: {
          profileUserId,
          projectId: project.id,
          password: password.trim(),
        },
      });

      if (fnError || !data?.success) {
        setError('Incorrect password. Please try again.');
      } else {
        onUnlock();
        setPassword('');
        onOpenChange(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setChecking(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20">
              <Lock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <DialogTitle>Protected Content</DialogTitle>
              <DialogDescription>{project.title}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            This project contains confidential content. Please enter the password to view.
          </p>

          <div className="space-y-2">
            <Label htmlFor="project-password">Password</Label>
            <Input
              id="project-password"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!password.trim() || checking}>
              {checking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
