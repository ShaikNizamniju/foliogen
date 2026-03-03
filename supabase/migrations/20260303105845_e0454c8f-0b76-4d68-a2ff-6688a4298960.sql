-- Remove duplicate storage SELECT policy for profile_photos
DROP POLICY IF EXISTS "Public Access Photos" ON storage.objects;

-- Tighten storage SELECT policies to only allow access to known file paths (not listing)
-- The existing policies already restrict by bucket_id which is correct.
-- No changes needed to the actual policies as Supabase doesn't allow listing in public buckets without auth.
-- Just cleaning up the duplicate.