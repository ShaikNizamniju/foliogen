-- Add calendly_url to profiles table for booking integration
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS calendly_url text;

-- Update the profiles_public view to include calendly_url
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public 
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  full_name,
  photo_url,
  headline,
  bio,
  location,
  website,
  linkedin_url,
  github_url,
  twitter_url,
  skills,
  key_highlights,
  selected_template,
  resume_url,
  projects,
  work_experience,
  views,
  calendly_url,
  created_at,
  updated_at
FROM public.profiles;