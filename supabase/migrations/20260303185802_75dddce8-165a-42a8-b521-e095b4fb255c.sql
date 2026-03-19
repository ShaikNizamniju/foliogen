
-- Add predicted_domain column to profiles
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='predicted_domain') THEN ALTER TABLE public.profiles ADD COLUMN predicted_domain text; END IF; END$$;

-- Create chat_queries table
CREATE TABLE IF NOT EXISTS public.chat_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id uuid NOT NULL,
  visitor_company text,
  visitor_question text,
  ai_response text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_queries ENABLE ROW LEVEL SECURITY;

-- Owner can view their chat queries
CREATE POLICY "Users can view their own chat queries"
ON public.chat_queries
FOR SELECT
USING (auth.uid() = profile_user_id);

-- No direct insert from client - edge function uses service role
CREATE POLICY "Service role can insert chat queries"
ON public.chat_queries
FOR INSERT
WITH CHECK (false);

-- Update profiles_public view to include predicted_domain
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public AS
SELECT
  id,
  user_id,
  full_name,
  photo_url,
  bio,
  headline,
  location,
  website,
  linkedin_url,
  github_url,
  twitter_url,
  skills,
  key_highlights,
  selected_template,
  selected_font,
  resume_url,
  calendly_url,
  username,
  views,
  is_pro,
  work_experience,
  projects,
  created_at,
  updated_at
FROM public.profiles;
