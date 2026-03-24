-- 1. Restrict profiles UPDATE to exclude payment fields
-- Drop existing ALL policy and replace with granular ones
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;

-- SELECT: users can read their own profile
CREATE POLICY "Users can read their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT: users can create their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: users can update their own profile but a trigger protects pro fields
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: users can delete their own profile
CREATE POLICY "Users can delete their own profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 2. Create/replace trigger to protect ALL payment-related fields from client updates
CREATE OR REPLACE FUNCTION public.protect_pro_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Protect all payment/subscription fields from client-side modification
  IF OLD.is_pro IS DISTINCT FROM NEW.is_pro THEN
    NEW.is_pro := OLD.is_pro;
  END IF;
  IF OLD.subscription_id IS DISTINCT FROM NEW.subscription_id THEN
    NEW.subscription_id := OLD.subscription_id;
  END IF;
  IF OLD.pro_since IS DISTINCT FROM NEW.pro_since THEN
    NEW.pro_since := OLD.pro_since;
  END IF;
  IF OLD.plan_type IS DISTINCT FROM NEW.plan_type THEN
    NEW.plan_type := OLD.plan_type;
  END IF;
  IF OLD.subscription_status IS DISTINCT FROM NEW.subscription_status THEN
    NEW.subscription_status := OLD.subscription_status;
  END IF;
  IF OLD.next_renewal_date IS DISTINCT FROM NEW.next_renewal_date THEN
    NEW.next_renewal_date := OLD.next_renewal_date;
  END IF;
  RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS protect_pro_fields_trigger ON profiles;
CREATE TRIGGER protect_pro_fields_trigger
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION protect_pro_fields();

-- 3. Fix analytics_events INSERT policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can insert analytics events" ON analytics_events;

CREATE POLICY "Authenticated users can insert analytics for public profiles"
ON analytics_events FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = analytics_events.profile_user_id
  )
);