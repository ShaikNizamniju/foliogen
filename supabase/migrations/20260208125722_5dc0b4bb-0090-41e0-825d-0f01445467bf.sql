-- Add Pro tier columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_pro boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_id text,
ADD COLUMN IF NOT EXISTS pro_since timestamp with time zone;

-- Update the profiles_public view to include is_pro (but not sensitive subscription data)
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public WITH (security_invoker=on) AS
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
  work_experience,
  projects,
  skills,
  key_highlights,
  views,
  resume_url,
  calendly_url,
  selected_template,
  created_at,
  updated_at
FROM public.profiles;