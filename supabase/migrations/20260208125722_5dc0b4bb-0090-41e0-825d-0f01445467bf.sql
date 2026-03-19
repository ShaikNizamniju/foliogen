-- Add Pro tier columns to profiles table
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_pro') THEN ALTER TABLE public.profiles ADD COLUMN is_pro boolean DEFAULT false; END IF; END$$;
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_id') THEN ALTER TABLE public.profiles ADD COLUMN subscription_id text; END IF; END$$;
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='pro_since') THEN ALTER TABLE public.profiles ADD COLUMN pro_since timestamp with time zone; END IF; END$$;

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