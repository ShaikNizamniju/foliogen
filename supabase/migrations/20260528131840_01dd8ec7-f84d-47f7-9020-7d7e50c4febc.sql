
-- 1. Recreate profiles_public so it bypasses RLS for read (already exposes only safe fields)
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public AS
SELECT
  bio, calendly_url, created_at, full_name, github_url, headline, id,
  key_highlights, linkedin_url, location, photo_url,
  CASE WHEN projects IS NOT NULL THEN (
    SELECT jsonb_agg(proj.value - 'password'::text)
    FROM jsonb_array_elements(profiles.projects) proj(value)
  ) ELSE NULL::jsonb END AS projects,
  resume_url, selected_font, selected_template, skills, twitter_url,
  updated_at, user_id, username, views, website, work_experience
FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- 2. Portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  slug TEXT NOT NULL DEFAULT 'default',
  custom_slug TEXT UNIQUE,
  template_name TEXT NOT NULL DEFAULT 'minimalist',
  data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, slug)
);

GRANT SELECT ON public.portfolios TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolios TO authenticated;
GRANT ALL ON public.portfolios TO service_role;

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolios are publicly viewable" ON public.portfolios
  FOR SELECT USING (true);
CREATE POLICY "Owners can insert their portfolios" ON public.portfolios
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update their portfolios" ON public.portfolios
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can delete their portfolios" ON public.portfolios
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_portfolios_custom_slug ON public.portfolios(custom_slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_user ON public.portfolios(user_id);

CREATE TRIGGER update_portfolios_updated_at
BEFORE UPDATE ON public.portfolios
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Chameleon links
CREATE TABLE IF NOT EXISTS public.chameleon_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  template_name TEXT,
  data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  industry_context TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.chameleon_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chameleon_links TO authenticated;
GRANT ALL ON public.chameleon_links TO service_role;

ALTER TABLE public.chameleon_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active chameleon links are viewable" ON public.chameleon_links
  FOR SELECT USING (is_active = true OR auth.uid() = user_id);
CREATE POLICY "Owners can insert chameleon links" ON public.chameleon_links
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update chameleon links" ON public.chameleon_links
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can delete chameleon links" ON public.chameleon_links
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
