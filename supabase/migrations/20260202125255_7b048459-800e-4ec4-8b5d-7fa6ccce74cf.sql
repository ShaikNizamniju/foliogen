-- Fix #1: Rate limits table - restrict SELECT access while allowing INSERT/UPDATE for rate limiting
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow rate limit management" ON public.rate_limits;

-- Allow anonymous INSERT for new rate limit entries
CREATE POLICY "Allow rate limit inserts"
ON public.rate_limits
FOR INSERT
WITH CHECK (true);

-- Allow anonymous UPDATE for incrementing request counts
CREATE POLICY "Allow rate limit updates"
ON public.rate_limits
FOR UPDATE
USING (true)
WITH CHECK (true);

-- No SELECT policy = default deny for anonymous users
-- Edge functions use service role which bypasses RLS anyway

-- Fix #2: Add server-side rate limiting to increment_views function
CREATE OR REPLACE FUNCTION public.increment_views(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_allowed BOOLEAN;
BEGIN
  -- Validate input
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  -- Server-side rate limiting: 10 view increments per hour per profile
  -- This prevents abuse even if client-side localStorage is bypassed
  SELECT public.check_rate_limit(
    p_user_id::text,  -- Use profile ID as key
    'increment_views',
    10,  -- Max 10 increments per hour
    60   -- 60 minute window
  ) INTO v_allowed;
  
  -- Silently ignore if rate limited (don't expose rate limit info)
  IF NOT v_allowed THEN
    RETURN;
  END IF;
  
  -- Increment views for the specified user
  UPDATE public.profiles
  SET views = COALESCE(views, 0) + 1
  WHERE user_id = p_user_id;
END;
$$;