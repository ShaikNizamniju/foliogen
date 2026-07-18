-- Add owner-scoped SELECT policy on profile_photos storage so that upsert uploads work.
-- Public display continues to work via the bucket's public setting + getPublicUrl (bypasses RLS).
-- This policy only lets an authenticated user see objects under their own {uid}/ folder — no listing of others.
DROP POLICY IF EXISTS "Users can read own profile photos" ON storage.objects;
CREATE POLICY "Users can read own profile photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile_photos'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);