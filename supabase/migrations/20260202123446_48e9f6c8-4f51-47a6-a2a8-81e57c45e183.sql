-- Fix security issues: increment_views function and profiles RLS policies

-- 1. Create rate_limits table for server-side rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(key, endpoint)
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and updates for rate limiting
CREATE POLICY "Allow rate limit management"
ON public.rate_limits
FOR ALL
USING (true)
WITH CHECK (true);

-- 2. Drop duplicate/overly permissive SELECT policies on profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public read access for portfolios" ON public.profiles;

-- 3. Create proper SELECT policy - authenticated users can only view their own profile
-- Anonymous users must use profiles_public view instead
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- 4. Create increment_views function with proper security
CREATE OR REPLACE FUNCTION public.increment_views(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate input
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  -- Increment views for the specified user
  UPDATE public.profiles
  SET views = COALESCE(views, 0) + 1
  WHERE user_id = p_user_id;
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.increment_views(UUID) TO anon, authenticated;

-- 5. Create rate limit check function for edge functions
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key TEXT,
  p_endpoint TEXT,
  p_max_requests INTEGER DEFAULT 20,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_count INTEGER;
  v_window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get or create rate limit record
  SELECT request_count, window_start INTO v_current_count, v_window_start
  FROM public.rate_limits
  WHERE key = p_key AND endpoint = p_endpoint;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.rate_limits (key, endpoint, request_count, window_start)
    VALUES (p_key, p_endpoint, 1, now());
    RETURN TRUE;
  END IF;
  
  -- If window has expired, reset the counter
  IF v_window_start < now() - (p_window_minutes || ' minutes')::INTERVAL THEN
    UPDATE public.rate_limits
    SET request_count = 1, window_start = now()
    WHERE key = p_key AND endpoint = p_endpoint;
    RETURN TRUE;
  END IF;
  
  -- If under limit, increment and allow
  IF v_current_count < p_max_requests THEN
    UPDATE public.rate_limits
    SET request_count = request_count + 1
    WHERE key = p_key AND endpoint = p_endpoint;
    RETURN TRUE;
  END IF;
  
  -- Rate limit exceeded
  RETURN FALSE;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO anon, authenticated;