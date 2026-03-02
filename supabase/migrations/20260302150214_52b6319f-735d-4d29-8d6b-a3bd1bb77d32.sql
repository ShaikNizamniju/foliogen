
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public AS
SELECT
  p.id,
  p.user_id,
  p.full_name,
  p.photo_url,
  p.bio,
  p.headline,
  p.location,
  p.website,
  p.linkedin_url,
  p.github_url,
  p.twitter_url,
  p.skills,
  p.key_highlights,
  p.selected_template,
  p.selected_font,
  p.resume_url,
  p.calendly_url,
  p.username,
  p.views,
  p.is_pro,
  p.created_at,
  p.updated_at,
  p.work_experience,
  jsonb_agg(proj - 'password') FILTER (WHERE proj IS NOT NULL) as projects
FROM profiles p
LEFT JOIN LATERAL jsonb_array_elements(p.projects) AS proj ON true
GROUP BY p.id;

GRANT SELECT ON public.profiles_public TO anon, authenticated;
