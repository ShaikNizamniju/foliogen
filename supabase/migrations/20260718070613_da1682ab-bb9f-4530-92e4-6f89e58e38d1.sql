
DROP POLICY IF EXISTS "Public can read project documents for published portfolios" ON storage.objects;
DROP POLICY IF EXISTS "Public can read profile photos for published portfolios" ON storage.objects;

CREATE POLICY "Public can read profile photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile_photos');
