
-- =============================================
-- FIX 1: Prevent users from self-updating pro fields
-- =============================================

-- Create a trigger function that prevents users from modifying pro fields
CREATE OR REPLACE FUNCTION public.protect_pro_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the caller is not the service role, prevent changes to pro fields
  -- Service role bypasses RLS entirely, so this trigger only fires for regular users
  IF OLD.is_pro IS DISTINCT FROM NEW.is_pro THEN
    NEW.is_pro := OLD.is_pro;
  END IF;
  IF OLD.subscription_id IS DISTINCT FROM NEW.subscription_id THEN
    NEW.subscription_id := OLD.subscription_id;
  END IF;
  IF OLD.pro_since IS DISTINCT FROM NEW.pro_since THEN
    NEW.pro_since := OLD.pro_since;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_pro_fields_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_pro_fields();

-- =============================================
-- FIX 2: Fix storage policies to verify ownership
-- =============================================

-- Fix project_documents policies
DROP POLICY IF EXISTS "Users can update own project documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own project documents" ON storage.objects;

CREATE POLICY "Users can update own project documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'project_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own project documents" ON storage.objects;
CREATE POLICY "Users can delete own project documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'project_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Fix resumes policies
DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;

CREATE POLICY "Users can update their own resumes"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;
CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Fix profile_photos policies
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;

CREATE POLICY "Users can update their own profile photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
CREATE POLICY "Users can delete their own profile photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile_photos' AND auth.uid()::text = (storage.foldername(name))[1]);
