-- Drop duplicate public-scoped INSERT policy on resumes bucket
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;

-- Tighten public read on profile_photos: require folder to match an actual profile owner
DROP POLICY IF EXISTS "Public can read profile photos by path" ON storage.objects;
CREATE POLICY "Public can read profile photos by owner folder"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'profile_photos'
  AND name <> ''
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id::text = (storage.foldername(name))[1]
  )
);

-- Tighten public read on project_documents: require folder to match an actual profile owner
DROP POLICY IF EXISTS "Public can read project documents by path" ON storage.objects;
CREATE POLICY "Public can read project documents by owner folder"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'project_documents'
  AND name <> ''
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id::text = (storage.foldername(name))[1]
  )
);