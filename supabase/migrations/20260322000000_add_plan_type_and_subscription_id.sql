-- Add plan alignment columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_id text,
ADD COLUMN IF NOT EXISTS is_pro boolean DEFAULT false;

-- Ensure these columns are accessible to the authenticated role
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
