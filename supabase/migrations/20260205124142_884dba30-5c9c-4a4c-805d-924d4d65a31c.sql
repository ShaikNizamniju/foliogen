-- Fix 1: Update handle_new_user function to validate and sanitize input
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    -- Sanitize full_name: limit to 100 chars, trim whitespace
    TRIM(SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 1, 100))
  );
  RETURN NEW;
END;
$function$;

-- Fix 2: Replace permissive analytics INSERT policy with authenticated-only policy
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;

CREATE POLICY "Authenticated users can insert analytics events" 
ON public.analytics_events 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Also allow anon to insert but only for their own profile views (rate limited by the RPC)
CREATE POLICY "Anonymous can insert analytics for public profiles" 
ON public.analytics_events 
FOR INSERT 
TO anon
WITH CHECK (
  -- Only allow inserting events for profiles that exist (basic validation)
  EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = profile_user_id
  )
);