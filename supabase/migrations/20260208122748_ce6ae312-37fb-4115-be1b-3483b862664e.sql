-- Add resume_url column to profiles table
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='resume_url') THEN ALTER TABLE public.profiles ADD COLUMN resume_url text; END IF; END$$;

-- Create resumes storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to resumes
DROP POLICY IF EXISTS "Public can view resumes" ON storage.objects;
CREATE POLICY "Public can view resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');

-- Allow authenticated users to upload their own resumes
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own resumes
DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
CREATE POLICY "Users can update their own resumes"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own resumes
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;
CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update the profiles_public view to include resume_url
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  full_name,
  photo_url,
  bio,
  headline,
  location,
  website,
  linkedin_url,
  github_url,
  twitter_url,
  skills,
  key_highlights,
  selected_template,
  work_experience,
  projects,
  views,
  resume_url,
  created_at,
  updated_at
FROM public.profiles;