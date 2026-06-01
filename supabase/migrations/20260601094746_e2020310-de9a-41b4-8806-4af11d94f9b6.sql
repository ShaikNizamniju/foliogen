-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. user_roles table (separate from profiles to prevent privilege escalation)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Grants (auth-only table; no anon access)
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- 4. RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Security-definer role check (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 6. Policies on user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can assign roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can revoke roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. Seed: grant admin to the project owner (Shaik Nizamuddin)
INSERT INTO public.user_roles (user_id, role)
VALUES ('1a1de2cd-8fb4-4227-8a46-999123f169ad', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 8. Allow admins to read every profile (in addition to existing self-read policy)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 9. Allow admins to override the protect_pro_fields trigger via direct service-role calls
--    (no policy change needed — they'll hit an edge function with service role for Pro toggling)

-- 10. Admin-visible view of error events (read from edge function logs via RPC later)
CREATE OR REPLACE FUNCTION public.admin_user_summary()
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  username text,
  is_pro boolean,
  plan_type text,
  views integer,
  created_at timestamptz,
  has_portfolio boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.user_id,
    p.email,
    p.full_name,
    p.username,
    p.is_pro,
    p.plan_type,
    p.views,
    p.created_at,
    EXISTS (SELECT 1 FROM public.portfolios pf WHERE pf.user_id = p.user_id) AS has_portfolio
  FROM public.profiles p
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY p.created_at DESC
$$;

GRANT EXECUTE ON FUNCTION public.admin_user_summary() TO authenticated;