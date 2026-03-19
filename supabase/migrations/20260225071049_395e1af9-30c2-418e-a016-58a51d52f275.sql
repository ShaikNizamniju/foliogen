
-- Add selected_font column to profiles
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='selected_font') THEN ALTER TABLE public.profiles ADD COLUMN selected_font TEXT DEFAULT NULL; END IF; END$$;

-- Recreate the profiles_public view to include selected_font and keep password stripping
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
  github_url,
  linkedin_url,
  twitter_url,
  website,
  skills,
  key_highlights,
  work_experience,
  CASE
    WHEN projects IS NOT NULL THEN (
      SELECT jsonb_agg(proj - 'password')
      FROM jsonb_array_elements(projects) AS proj
    )
    ELSE NULL
  END AS projects,
  selected_template,
  selected_font,
  views,
  username,
  resume_url,
  calendly_url,
  created_at,
  updated_at
FROM public.profiles;
