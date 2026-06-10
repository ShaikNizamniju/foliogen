DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public
WITH (security_invoker=on) AS
SELECT
  bio,
  calendly_url,
  created_at,
  full_name,
  github_url,
  headline,
  id,
  key_highlights,
  linkedin_url,
  location,
  photo_url,
  CASE
    WHEN (projects IS NOT NULL) THEN (
      SELECT jsonb_agg((proj.value - 'password'::text))
      FROM jsonb_array_elements(profiles.projects) proj(value)
    )
    ELSE NULL::jsonb
  END AS projects,
  resume_url,
  selected_font,
  selected_template,
  skills,
  twitter_url,
  updated_at,
  user_id,
  username,
  views,
  website,
  work_experience,
  email
FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;