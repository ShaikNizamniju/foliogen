DROP TRIGGER IF EXISTS protect_premium_templates_trigger ON public.profiles;
CREATE OR REPLACE FUNCTION public.protect_premium_templates()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  -- All templates are free for everyone; no gating.
  RETURN NEW;
END;
$function$;