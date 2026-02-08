import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface AiPrep {
  company_summary: string;
  likely_questions: string[];
  questions_to_ask: string[];
}

export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: JobStatus;
  salary_range: string | null;
  job_url: string | null;
  notes: string | null;
  ai_prep: AiPrep | null;
  created_at: string;
  updated_at: string;
}

export type JobApplicationInput = {
  company: string;
  role: string;
  status?: JobStatus;
  salary_range?: string;
  job_url?: string;
  notes?: string;
};

export function useJobApplications() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[JobApplications] Error fetching:', error);
      toast.error('Failed to load job applications');
    } else {
      setJobs((data as unknown as JobApplication[]) || []);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const addJob = async (input: JobApplicationInput) => {
    if (!user?.id) return null;

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        user_id: user.id,
        company: input.company,
        role: input.role,
        status: input.status || 'saved',
        salary_range: input.salary_range || null,
        job_url: input.job_url || null,
        notes: input.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[JobApplications] Error adding:', error);
      toast.error('Failed to add job application');
      return null;
    }

    setJobs((prev) => [data as unknown as JobApplication, ...prev]);
    toast.success('Job application added!');
    return data as unknown as JobApplication;
  };

  const updateJob = async (id: string, updates: Partial<JobApplicationInput & { ai_prep?: AiPrep }>) => {
    // Convert ai_prep to JSON-compatible format
    const dbUpdates: Record<string, unknown> = { ...updates };
    if (updates.ai_prep) {
      dbUpdates.ai_prep = updates.ai_prep as unknown;
    }

    const { error } = await supabase
      .from('job_applications')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('[JobApplications] Error updating:', error);
      toast.error('Failed to update job application');
      return false;
    }

    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...updates } as JobApplication : job))
    );
    return true;
  };

  const updateJobStatus = async (id: string, status: JobStatus) => {
    return updateJob(id, { status });
  };

  const saveAiPrep = async (id: string, aiPrep: AiPrep) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ ai_prep: JSON.parse(JSON.stringify(aiPrep)) })
      .eq('id', id);

    if (error) {
      console.error('[JobApplications] Error saving AI prep:', error);
      toast.error('Failed to save interview prep');
      return false;
    }

    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ai_prep: aiPrep } : job))
    );
    return true;
  };

  const deleteJob = async (id: string) => {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[JobApplications] Error deleting:', error);
      toast.error('Failed to delete job application');
      return false;
    }

    setJobs((prev) => prev.filter((job) => job.id !== id));
    toast.success('Job application deleted');
    return true;
  };

  // Get jobs grouped by status
  const getJobsByStatus = (status: JobStatus) => jobs.filter((job) => job.status === status);

  // Get summary counts
  const getCounts = () => ({
    saved: getJobsByStatus('saved').length,
    applied: getJobsByStatus('applied').length,
    interviewing: getJobsByStatus('interviewing').length,
    offer: getJobsByStatus('offer').length,
    rejected: getJobsByStatus('rejected').length,
    total: jobs.length,
  });

  return {
    jobs,
    loading,
    addJob,
    updateJob,
    updateJobStatus,
    saveAiPrep,
    deleteJob,
    getJobsByStatus,
    getCounts,
    refetch: fetchJobs,
  };
}
