-- 1. Restore password-stripping in profiles_public view (drop+recreate to allow column reorder)
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public AS
SELECT
  bio,
  calendly_url,
  created_at,
  full_name,
  github_url,
  headline,
  id,
  is_pro,
  key_highlights,
  linkedin_url,
  location,
  photo_url,
  CASE
    WHEN projects IS NOT NULL THEN (
      SELECT jsonb_agg(proj - 'password')
      FROM jsonb_array_elements(projects) AS proj
    )
    ELSE NULL
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
  work_experience
FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- 2. Tighten visit_logs INSERT policy: only allow inserts referencing existing profiles
DROP POLICY IF EXISTS "Anyone can insert visit logs" ON public.visit_logs;

CREATE POLICY "Visit logs only for existing profiles (anon)"
ON public.visit_logs
FOR INSERT
TO anon
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = visit_logs.profile_user_id)
);

CREATE POLICY "Visit logs only for existing profiles (authenticated)"
ON public.visit_logs
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = visit_logs.profile_user_id)
);

-- 3. Restrict documents storage bucket: make private and require ownership
UPDATE storage.buckets SET public = false WHERE id = 'documents';

DROP POLICY IF EXISTS "Public can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Documents are publicly accessible" ON storage.objects;

CREATE POLICY "Users can read own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);