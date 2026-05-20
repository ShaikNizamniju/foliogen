-- 1. Drop dangerous public storage policies
DROP POLICY IF EXISTS "Public can view document files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Photos" ON storage.objects;

-- 2. Recreate profiles_public without is_pro
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker = true)
AS
SELECT bio, calendly_url, created_at, full_name, github_url, headline, id,
  key_highlights, linkedin_url, location, photo_url,
  CASE WHEN projects IS NOT NULL THEN (
    SELECT jsonb_agg(proj.value - 'password'::text)
    FROM jsonb_array_elements(profiles.projects) proj(value)
  ) ELSE NULL::jsonb END AS projects,
  resume_url, selected_font, selected_template, skills, twitter_url,
  updated_at, user_id, username, views, website, work_experience
FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- 3. Lock referrals reward fields
DROP POLICY IF EXISTS "Block referral mutations" ON public.referrals;
CREATE POLICY "Block referral updates"
ON public.referrals AS RESTRICTIVE
FOR UPDATE TO authenticated, anon
USING (false) WITH CHECK (false);

CREATE POLICY "Block referral deletes"
ON public.referrals AS RESTRICTIVE
FOR DELETE TO authenticated, anon
USING (false);

-- 4. Revoke EXECUTE on internal SECURITY DEFINER functions (triggers don't need EXECUTE grants)
REVOKE EXECUTE ON FUNCTION public.protect_pro_fields() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.protect_premium_templates() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM anon, authenticated, public;
-- increment_views remains callable (used for public portfolio view tracking)