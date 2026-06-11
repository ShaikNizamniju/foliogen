
-- Restrict anon read access on profile_photos and project_documents to owners with a published portfolio
DROP POLICY IF EXISTS "Public can read profile photos by owner folder" ON storage.objects;
CREATE POLICY "Public can read profile photos for published portfolios"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'profile_photos'
  AND name <> ''
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.portfolios p
      WHERE (p.user_id)::text = (storage.foldername(objects.name))[1]
    )
  )
);

DROP POLICY IF EXISTS "Public can read project documents by owner folder" ON storage.objects;
CREATE POLICY "Public can read project documents for published portfolios"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'project_documents'
  AND name <> ''
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.portfolios p
      WHERE (p.user_id)::text = (storage.foldername(objects.name))[1]
    )
  )
);
