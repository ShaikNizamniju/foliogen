
-- Fix security definer view by using security_invoker
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
