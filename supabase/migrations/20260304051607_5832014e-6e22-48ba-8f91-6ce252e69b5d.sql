
-- Fix profiles_public view to strip password from projects JSONB
CREATE OR REPLACE VIEW public.profiles_public AS
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
  -- Strip password from each project object in the JSONB array
  CASE
    WHEN projects IS NULL THEN NULL
    ELSE (
      SELECT jsonb_agg(proj - 'password')
      FROM jsonb_array_elements(projects) AS proj
    )
  END AS projects,
  created_at,
  updated_at
FROM profiles;

-- Re-grant access to both roles
GRANT SELECT ON public.profiles_public TO anon;
GRANT SELECT ON public.profiles_public TO authenticated;
