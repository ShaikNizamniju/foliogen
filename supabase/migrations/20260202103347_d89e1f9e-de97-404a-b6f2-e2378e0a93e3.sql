-- 1. Create analytics_events table for detailed view tracking
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_user_id UUID NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'page_view',
  referrer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  page_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics (for public portfolio views)
CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Only profile owners can view their analytics
CREATE POLICY "Users can view their own analytics"
ON public.analytics_events
FOR SELECT
USING (auth.uid() = profile_user_id);

-- Create index for efficient queries
CREATE INDEX idx_analytics_events_profile_user_id ON public.analytics_events(profile_user_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);

-- 2. Add SEO fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[];

-- 3. Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, slug)
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Users can manage their own posts
CREATE POLICY "Users can create their own blog posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog posts"
ON public.blog_posts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog posts"
ON public.blog_posts
FOR DELETE
USING (auth.uid() = user_id);

-- Anyone can view published posts, owners can view all their posts
CREATE POLICY "Published posts are viewable by everyone"
ON public.blog_posts
FOR SELECT
USING (published = true OR auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_blog_posts_user_id ON public.blog_posts(user_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);