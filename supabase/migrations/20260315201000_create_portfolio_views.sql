-- Create portfolio_views table for tracking visits
CREATE TABLE IF NOT EXISTS public.portfolio_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  viewer_ip TEXT,
  viewer_company TEXT,
  viewer_region TEXT,
  referrer TEXT,
  persona_active TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_views ENABLE ROW LEVEL SECURITY;

-- Policy: Only the owner of the profile can read their analytics
CREATE POLICY "Owners can view their own portfolio analytics"
  ON public.portfolio_views
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = portfolio_views.profile_id
      AND public.profiles.user_id = auth.uid()
    )
  );

-- Policy: Allow anonymous insertions for tracking views
CREATE POLICY "Allow anonymous view logging"
  ON public.portfolio_views
  FOR INSERT
  WITH CHECK (true);

-- Index for performance on the dashboard
CREATE INDEX IF NOT EXISTS idx_portfolio_views_profile_id ON public.portfolio_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_views_created_at ON public.portfolio_views(created_at);
