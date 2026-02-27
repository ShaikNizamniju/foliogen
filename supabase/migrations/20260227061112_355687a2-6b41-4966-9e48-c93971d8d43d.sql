-- Recreate the view WITHOUT security_invoker so it can serve public data
-- The view itself is the security boundary: it excludes email, subscription_id, pro_since, and strips passwords from projects
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
  work_experience,
  CASE
    WHEN projects IS NOT NULL THEN (
      SELECT jsonb_agg(proj - 'password')
      FROM jsonb_array_elements(projects) AS proj
    )
    ELSE NULL
  END AS projects,
  skills,
  key_highlights,
  views,
  selected_template,
  selected_font,
  resume_url,
  calendly_url,
  username,
  is_pro,
  created_at,
  updated_at
FROM public.profiles;

-- Grant public access to the safe view
GRANT SELECT ON public.profiles_public TO anon, authenticated;