-- Create portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_name text NOT NULL DEFAULT 'minimalist',
    slug text NOT NULL,
    data_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    views integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, slug)
);

-- RLS Policies
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Portfolios are viewable by everyone." ON public.portfolios;
CREATE POLICY "Portfolios are viewable by everyone." ON public.portfolios
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own portfolios." ON public.portfolios;
CREATE POLICY "Users can insert their own portfolios." ON public.portfolios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own portfolios." ON public.portfolios;
CREATE POLICY "Users can update their own portfolios." ON public.portfolios
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own portfolios." ON public.portfolios;
CREATE POLICY "Users can delete their own portfolios." ON public.portfolios
    FOR DELETE USING (auth.uid() = user_id);

-- Migration logic: Move existing published data from profiles_public/profiles
-- If they have a username, use it as default slug, otherwise use 'default'.
/*
INSERT INTO public.portfolios (user_id, slug, template_name, data_json, views)
SELECT 
    id as user_id, 
    'default' as slug, 
    COALESCE(selected_template, 'minimalist') as template_name,
    jsonb_build_object(
        'full_name', full_name,
        'photo_url', photo_url,
        'bio', bio,
        'headline', headline,
        'location', location,
        'email', email,
        'website', website,
        'linkedin_url', linkedin_url,
        'github_url', github_url,
        'twitter_url', twitter_url,
        'work_experience', work_experience,
        'projects', projects,
        'skills', skills,
        'key_highlights', key_highlights,
        'calendly_url', calendly_url,
        'resume_url', resume_url,
        'selected_font', selected_font,
        'hide_photo', hide_photo
    ) as data_json,
    views
FROM public.profiles
ON CONFLICT (user_id, slug) DO NOTHING;
*/
