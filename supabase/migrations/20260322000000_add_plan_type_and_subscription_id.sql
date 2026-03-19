-- 1. Create portfolios table if not exists (fallback for direct SQL execution)
CREATE TABLE IF NOT EXISTS public.portfolios (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_name text NOT NULL DEFAULT 'minimalist',
    slug text NOT NULL,
    data_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    views integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    status text DEFAULT 'published',
    UNIQUE(user_id, slug)
);

-- 2. Add plan and subscription columns to profiles if missing
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_id text,
ADD COLUMN IF NOT EXISTS is_pro boolean DEFAULT false;

-- 3. Create job_applications table if not exists (failing relation fix)
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    status TEXT DEFAULT 'applied',
    salary_range TEXT,
    location TEXT,
    notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS and Grant Permissions
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- 5. Safety: Refresh profiles_public view to include new fields
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public WITH (security_invoker=on) AS
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
  plan_type,
  is_pro,
  created_at,
  updated_at
FROM public.profiles;
