-- Create visit_logs table for tracking recruiter visits with personalized links
CREATE TABLE IF NOT EXISTS public.visit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id uuid NOT NULL,
  company_name text,
  role_target text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.visit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for anonymous tracking)
DROP POLICY IF EXISTS "Anyone can insert visit logs" ON public.visit_logs;
CREATE POLICY "Anyone can insert visit logs"
ON public.visit_logs
FOR INSERT
WITH CHECK (true);

-- Policy: Users can only view their own visit logs
DROP POLICY IF EXISTS "Users can view their own visit logs" ON public.visit_logs;
CREATE POLICY "Users can view their own visit logs"
ON public.visit_logs
FOR SELECT
USING (auth.uid() = profile_user_id);

-- Add index for faster queries by profile and date
CREATE INDEX IF NOT EXISTS idx_visit_logs_profile_created ON public.visit_logs (profile_user_id, created_at DESC);