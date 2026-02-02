-- Fix 1: Create a public profiles view that excludes email
-- This allows public portfolio viewing without exposing user emails

CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = on) AS
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
  work_experience,
  projects,
  skills,
  key_highlights,
  selected_template,
  views,
  created_at,
  updated_at
  -- Intentionally excludes: email
FROM public.profiles;

-- Grant access to the public view
GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Fix 2: Drop the overly permissive documents policy
-- The "Public can view documents for portfolios" allows anyone to view all documents
DROP POLICY IF EXISTS "Public can view documents for portfolios" ON public.documents;

-- Create a more restrictive policy: only allow viewing documents that are associated with public portfolios
-- For now, only owners can view their documents since there's no "is_public" flag
-- The existing "Users can view their own documents" policy already handles owner access