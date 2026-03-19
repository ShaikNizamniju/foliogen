-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a new policy allowing anyone to read profiles (for public portfolios)
DROP POLICY IF EXISTS "Public read access for portfolios" ON public.profiles;
CREATE POLICY "Public read access for portfolios"
ON public.profiles
FOR SELECT
USING (true);

-- Note: INSERT, UPDATE, DELETE policies remain unchanged - only authenticated users can modify their own profiles