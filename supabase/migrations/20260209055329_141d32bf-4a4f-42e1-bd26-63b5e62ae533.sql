-- Add username column for custom portfolio URLs
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='username') THEN ALTER TABLE public.profiles ADD COLUMN username text UNIQUE; END IF; END$$;

-- Add index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username) WHERE username IS NOT NULL;

-- Update profiles_public view to include username
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public WITH (security_invoker = on) AS
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
  selected_template,
  resume_url,
  calendly_url,
  username,
  created_at,
  updated_at
FROM public.profiles;