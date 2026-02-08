import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobApplication, JobApplicationInput, JobStatus } from '@/hooks/useJobApplications';
import { Loader2 } from 'lucide-react';

interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: JobApplicationInput) => Promise<JobApplication | null>;
  onUpdate?: (id: string, data: Partial<JobApplicationInput>) => Promise<boolean>;
  editingJob?: JobApplication | null;
}

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'saved', label: '📌 Saved' },
  { value: 'applied', label: '📤 Applied' },
  { value: 'interviewing', label: '🎤 Interviewing' },
  { value: 'offer', label: '🎉 Offer' },
  { value: 'rejected', label: '❌ Rejected' },
];

export function AddJobDialog({ open, onOpenChange, onSubmit, onUpdate, editingJob }: AddJobDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JobApplicationInput>({
    company: '',
    role: '',
    status: 'saved',
    salary_range: '',
    job_url: '',
    notes: '',
  });

  // Reset form when dialog opens/closes or editing job changes
  useEffect(() => {
    if (editingJob) {
      setFormData({
        company: editingJob.company,
        role: editingJob.role,
        status: editingJob.status,
        salary_range: editingJob.salary_range || '',
        job_url: editingJob.job_url || '',
        notes: editingJob.notes || '',
      });
    } else {
      setFormData({
        company: '',
        role: '',
        status: 'saved',
        salary_range: '',
        job_url: '',
        notes: '',
      });
    }
  }, [editingJob, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) return;

    setLoading(true);

    if (editingJob && onUpdate) {
      const success = await onUpdate(editingJob.id, formData);
      if (success) onOpenChange(false);
    } else {
      const result = await onSubmit(formData);
      if (result) onOpenChange(false);
    }

    setLoading(false);
  };

  const isEditing = !!editingJob;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Job Application' : 'Add Job Application'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of this job application.' : 'Track a new job opportunity.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="e.g., Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: JobStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              placeholder="e.g., Senior Software Engineer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                placeholder="e.g., $150k - $180k"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Job URL</Label>
              <Input
                id="url"
                placeholder="https://..."
                type="url"
                value={formData.job_url}
                onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.company.trim() || !formData.role.trim()}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Add Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
