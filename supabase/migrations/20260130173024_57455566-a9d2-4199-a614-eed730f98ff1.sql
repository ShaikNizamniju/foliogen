-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_photos', 'profile_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view profile photos (public bucket)
DROP POLICY IF EXISTS "Public read access for profile photos" ON storage.objects;
CREATE POLICY "Public read access for profile photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile_photos');

-- Allow authenticated users to upload their own photos
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile_photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own photos
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
CREATE POLICY "Users can update their own profile photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile_photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own photos
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
CREATE POLICY "Users can delete their own profile photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile_photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);