-- 1. Enable pgcrypto for bcrypt-style password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Trigger to hash any plaintext project passwords stored in profiles.projects JSONB.
-- Detects "already hashed" via the bcrypt prefix ($2a$ / $2b$ / $2y$).
CREATE OR REPLACE FUNCTION public.hash_project_passwords()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_projects jsonb := '[]'::jsonb;
  v_proj jsonb;
  v_pw text;
BEGIN
  IF NEW.projects IS NULL OR jsonb_typeof(NEW.projects) <> 'array' THEN
    RETURN NEW;
  END IF;

  FOR v_proj IN SELECT jsonb_array_elements(NEW.projects) LOOP
    v_pw := v_proj->>'password';
    IF v_pw IS NOT NULL AND length(v_pw) > 0 AND v_pw NOT LIKE '$2%' THEN
      v_proj := jsonb_set(
        v_proj,
        '{password}',
        to_jsonb(crypt(v_pw, gen_salt('bf', 10)))
      );
    END IF;
    v_new_projects := v_new_projects || v_proj;
  END LOOP;

  NEW.projects := v_new_projects;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_hash_project_passwords_ins ON public.profiles;
DROP TRIGGER IF EXISTS trg_hash_project_passwords_upd ON public.profiles;

CREATE TRIGGER trg_hash_project_passwords_ins
BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.hash_project_passwords();

CREATE TRIGGER trg_hash_project_passwords_upd
BEFORE UPDATE OF projects ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.hash_project_passwords();

-- 3. Migrate existing plaintext passwords in-place
UPDATE public.profiles
SET projects = (
  SELECT jsonb_agg(
    CASE
      WHEN (p->>'password') IS NOT NULL
       AND length(p->>'password') > 0
       AND (p->>'password') NOT LIKE '$2%'
      THEN jsonb_set(p, '{password}', to_jsonb(crypt(p->>'password', gen_salt('bf', 10))))
      ELSE p
    END
  )
  FROM jsonb_array_elements(projects) p
)
WHERE jsonb_typeof(projects) = 'array'
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(projects) p
    WHERE (p->>'password') IS NOT NULL
      AND length(p->>'password') > 0
      AND (p->>'password') NOT LIKE '$2%'
  );

-- 4. Secure server-side verify function (constant-time via crypt())
CREATE OR REPLACE FUNCTION public.verify_project_password(
  p_user_id uuid,
  p_project_id text,
  p_password text
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_hash text;
BEGIN
  IF p_user_id IS NULL OR p_project_id IS NULL OR p_password IS NULL THEN
    RETURN false;
  END IF;

  SELECT (proj->>'password')
    INTO v_hash
  FROM public.profiles pr,
       LATERAL jsonb_array_elements(pr.projects) proj
  WHERE pr.user_id = p_user_id
    AND (proj->>'id') = p_project_id
    AND COALESCE((proj->>'isProtected')::boolean, false) = true
  LIMIT 1;

  IF v_hash IS NULL OR length(v_hash) = 0 THEN
    RETURN false;
  END IF;

  RETURN crypt(p_password, v_hash) = v_hash;
END;
$$;

-- 5. Lock down SECURITY DEFINER function execution: only expose what the app actually needs.
REVOKE EXECUTE ON FUNCTION public.admin_user_summary() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.admin_user_summary() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) TO service_role;

REVOKE EXECUTE ON FUNCTION public.increment_views(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.increment_views(uuid) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.verify_project_password(uuid, text, text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.verify_project_password(uuid, text, text) TO anon, authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.hash_project_passwords() FROM PUBLIC, anon, authenticated;

-- 6. Recreate profiles_public view explicitly as security_invoker so the
--    Supabase linter no longer flags it as SECURITY DEFINER.
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker = true) AS
SELECT
  bio, calendly_url, created_at, full_name, github_url, headline, id,
  key_highlights, linkedin_url, location, photo_url,
  CASE
    WHEN projects IS NOT NULL THEN (
      SELECT jsonb_agg((proj.value - 'password'))
      FROM jsonb_array_elements(profiles.projects) proj(value)
    )
    ELSE NULL::jsonb
  END AS projects,
  resume_url, selected_font, selected_template, skills, twitter_url,
  updated_at, user_id, username, views, website, work_experience, email
FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated, service_role;