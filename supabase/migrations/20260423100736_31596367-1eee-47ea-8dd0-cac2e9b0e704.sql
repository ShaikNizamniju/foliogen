
-- 1. Make resumes bucket private
UPDATE storage.buckets SET public = false WHERE id = 'resumes';

-- Drop any existing broad policies on resumes
DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read resumes" ON storage.objects;
DROP POLICY IF EXISTS "Resumes are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

CREATE POLICY "Users can read own resumes"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own resumes"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own resumes"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own resumes"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 2. Tighten analytics_events: remove anonymous insert
DROP POLICY IF EXISTS "Anonymous can insert analytics for public profiles" ON public.analytics_events;

-- 3. Restrict public bucket listing for profile_photos and project_documents
-- Public read of specific objects remains (by direct URL), but listing root is blocked.
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;

CREATE POLICY "Public can read profile photos by path"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'profile_photos'
  AND (storage.foldername(name))[1] IS NOT NULL
);

CREATE POLICY "Public can read project documents by path"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'project_documents'
  AND (storage.foldername(name))[1] IS NOT NULL
);
