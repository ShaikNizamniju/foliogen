-- Remove any lingering public-read policies on the resumes bucket
DROP POLICY IF EXISTS "Public can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public Access for resumes" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Resumes are publicly accessible" ON storage.objects;

-- Ensure the resumes bucket is private (idempotent)
UPDATE storage.buckets SET public = false WHERE id = 'resumes';

-- Remove broad public listing policies from public buckets
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view project documents" ON storage.objects;
DROP POLICY IF EXISTS "Profile photos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Project documents are publicly accessible" ON storage.objects;

-- Re-create scoped read policies that allow direct file fetches but prevent
-- listing the entire bucket root (require a folder path, never list root='').
DROP POLICY IF EXISTS "Public can read profile photos by path" ON storage.objects;
CREATE POLICY "Public can read profile photos by path"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'profile_photos'
  AND name <> ''
  AND (storage.foldername(name))[1] IS NOT NULL
);

DROP POLICY IF EXISTS "Public can read project documents by path" ON storage.objects;
CREATE POLICY "Public can read project documents by path"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'project_documents'
  AND name <> ''
  AND (storage.foldername(name))[1] IS NOT NULL
);

-- Mark the public buckets as non-public for listing purposes
UPDATE storage.buckets SET public = false WHERE id IN ('profile_photos', 'project_documents');

-- Owner-only write policies for the public-read buckets (idempotent)
DROP POLICY IF EXISTS "Users can upload own profile photos" ON storage.objects;
CREATE POLICY "Users can upload own profile photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update own profile photos" ON storage.objects;
CREATE POLICY "Users can update own profile photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own profile photos" ON storage.objects;
CREATE POLICY "Users can delete own profile photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can upload own project documents" ON storage.objects;
CREATE POLICY "Users can upload own project documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'project_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update own project documents" ON storage.objects;
CREATE POLICY "Users can update own project documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'project_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own project documents" ON storage.objects;
CREATE POLICY "Users can delete own project documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'project_documents' AND auth.uid()::text = (storage.foldername(name))[1]);