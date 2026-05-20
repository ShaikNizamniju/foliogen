CREATE POLICY "Anonymous can insert analytics for public profiles"
ON public.analytics_events
FOR INSERT
TO anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = analytics_events.profile_user_id
  )
);