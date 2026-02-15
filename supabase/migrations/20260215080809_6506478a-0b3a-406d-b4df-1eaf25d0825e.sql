-- Fix: Strip password fields from projects JSONB in the public view
-- This prevents plaintext passwords from being exposed via the public API

DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
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
  -- Strip password from each project object in the JSONB array
  CASE
    WHEN projects IS NOT NULL THEN (
      SELECT jsonb_agg(
        proj - 'password'
      )
      FROM jsonb_array_elements(projects) AS proj
    )
    ELSE NULL
  END AS projects,
  skills,
  key_highlights,
  views,
  selected_template,
  resume_url,
  calendly_url,
  username,
  created_at,
  updated_at
FROM profiles;