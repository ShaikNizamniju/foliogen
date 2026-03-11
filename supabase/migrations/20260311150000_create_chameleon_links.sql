-- Create chameleon_links table
CREATE TABLE IF NOT EXISTS public.chameleon_links (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug text NOT NULL UNIQUE,
    industry_context text NOT NULL,
    data_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    template_name text NOT NULL DEFAULT 'modern-dark',
    is_active boolean DEFAULT true,
    views integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.chameleon_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "everyone can view active chameleon links" 
ON public.chameleon_links FOR SELECT USING (is_active = true);

CREATE POLICY "users can insert their own links" 
ON public.chameleon_links FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update their own links" 
ON public.chameleon_links FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users can delete their own links" 
ON public.chameleon_links FOR DELETE USING (auth.uid() = user_id);

-- Create visit_logs table
CREATE TABLE IF NOT EXISTS public.visit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, 
    link_type text NOT NULL, -- 'portfolio' or 'chameleon'
    link_id text NOT NULL, -- the slug or id
    industry_context text,
    device_type text,
    location text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.visit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view their visit logs"
ON public.visit_logs FOR SELECT USING (auth.uid() = user_id);

-- allow inserting visit logs safely from public client
CREATE POLICY "anyone can insert visit logs"
ON public.visit_logs FOR INSERT WITH CHECK (true);
