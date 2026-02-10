-- Fix 1: Remove overly permissive rate_limits policies
-- Edge functions use SECURITY DEFINER functions (check_rate_limit, increment_views)
-- which bypass RLS, so no public policies are needed
DROP POLICY IF EXISTS "Allow rate limit inserts" ON public.rate_limits;
DROP POLICY IF EXISTS "Allow rate limit updates" ON public.rate_limits;

-- Fix 2: Add trigger to prevent non-pro users from selecting premium templates
-- Free templates: 'minimalist' (default) and 'creative'
CREATE OR REPLACE FUNCTION public.protect_premium_templates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only check if selected_template is being changed
  IF OLD.selected_template IS DISTINCT FROM NEW.selected_template THEN
    -- Allow free templates for everyone
    IF NEW.selected_template IN ('minimalist', 'creative') THEN
      RETURN NEW;
    END IF;
    -- For premium templates, require is_pro = true
    IF NOT COALESCE(NEW.is_pro, false) THEN
      NEW.selected_template := OLD.selected_template;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_premium_templates_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_premium_templates();