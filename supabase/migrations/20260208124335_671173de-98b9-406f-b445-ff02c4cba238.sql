-- Create missing helper function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create job_applications table for Kanban board
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interviewing', 'offer', 'rejected')),
  salary_range text,
  job_url text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Users can only CRUD their own job applications
CREATE POLICY "Users can manage their own job applications"
ON public.job_applications
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_job_applications_user_status ON public.job_applications (user_id, status);

-- Add trigger for updated_at
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();