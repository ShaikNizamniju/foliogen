-- Migration: Add font_config column to profiles table and update profiles_public view
-- Problem: Users experiencing error "Could not find the 'font_config' column of 'profiles' in the schema cache"
-- Solution: Add the missing column with a safe default and update dependent views.

-- 1. Add font_config column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='font_config') THEN
        ALTER TABLE public.profiles 
        ADD COLUMN font_config JSONB DEFAULT '{"size": "base", "isBold": false, "isItalic": false, "isUnderline": false, "alignment": "left"}'::jsonb;
    END IF;
END $$;

-- 2. Update the profiles_public view to include font_config
-- Note: We drop and recreate it to ensure the schema is in sync and avoid column name mismatch errors.
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public AS
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
  CASE
    WHEN projects IS NOT NULL THEN (
      SELECT jsonb_agg(proj - 'password')
      FROM jsonb_array_elements(projects) AS proj
    )
    ELSE NULL
  END AS projects,
  skills,
  key_highlights,
  views,
  selected_template,
  selected_font,
  font_config, -- New column added here
  resume_url,
  calendly_url,
  username,
  is_pro,
  created_at,
  updated_at
FROM public.profiles;

-- Restore permissions
GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- 3. Notify PostgREST to reload the schema cache immediately
-- This resolves the "schema cache mismatch" error.
NOTIFY pgrst, 'reload schema';
