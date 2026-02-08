-- Add ai_prep column to store interview preparation data
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS ai_prep jsonb DEFAULT NULL;