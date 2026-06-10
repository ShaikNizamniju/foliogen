
-- Replace permissive INSERT policies with portfolio-existence checks
DROP POLICY IF EXISTS "Anonymous can insert analytics for public profiles" ON public.analytics_events;
DROP POLICY IF EXISTS "Authenticated users can insert analytics for public profiles" ON public.analytics_events;
DROP POLICY IF EXISTS "Visit logs only for existing profiles (anon)" ON public.visit_logs;
DROP POLICY IF EXISTS "Visit logs only for existing profiles (authenticated)" ON public.visit_logs;

CREATE POLICY "Analytics inserts for published portfolios (anon)"
  ON public.analytics_events FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.user_id = analytics_events.profile_user_id));

CREATE POLICY "Analytics inserts for published portfolios (auth)"
  ON public.analytics_events FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.user_id = analytics_events.profile_user_id));

CREATE POLICY "Visit logs for published portfolios (anon)"
  ON public.visit_logs FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.user_id = visit_logs.profile_user_id));

CREATE POLICY "Visit logs for published portfolios (auth)"
  ON public.visit_logs FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.user_id = visit_logs.profile_user_id));

-- BEFORE INSERT trigger: server-side rate limit + field length caps for analytics_events
CREATE OR REPLACE FUNCTION public.guard_analytics_event_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_allowed boolean;
BEGIN
  SELECT public.check_rate_limit(
    NEW.profile_user_id::text,
    'analytics_events_insert',
    120,  -- max 120 events
    60    -- per 60 minutes
  ) INTO v_allowed;
  IF NOT v_allowed THEN
    RETURN NULL; -- silently drop spam
  END IF;

  NEW.referrer    := SUBSTRING(COALESCE(NEW.referrer, '')    FROM 1 FOR 500);
  NEW.country     := SUBSTRING(COALESCE(NEW.country, '')     FROM 1 FOR 80);
  NEW.city        := SUBSTRING(COALESCE(NEW.city, '')        FROM 1 FOR 80);
  NEW.device_type := SUBSTRING(COALESCE(NEW.device_type, '') FROM 1 FOR 40);
  NEW.browser     := SUBSTRING(COALESCE(NEW.browser, '')     FROM 1 FOR 80);
  NEW.page_path   := SUBSTRING(COALESCE(NEW.page_path, '')   FROM 1 FOR 500);
  NEW.event_type  := SUBSTRING(COALESCE(NEW.event_type, 'page_view') FROM 1 FOR 40);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_analytics_event_insert ON public.analytics_events;
CREATE TRIGGER guard_analytics_event_insert
  BEFORE INSERT ON public.analytics_events
  FOR EACH ROW EXECUTE FUNCTION public.guard_analytics_event_insert();

-- BEFORE INSERT trigger: server-side rate limit + field length caps for visit_logs
CREATE OR REPLACE FUNCTION public.guard_visit_log_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_allowed boolean;
BEGIN
  SELECT public.check_rate_limit(
    NEW.profile_user_id::text,
    'visit_logs_insert',
    60,   -- max 60 visit logs
    60    -- per 60 minutes
  ) INTO v_allowed;
  IF NOT v_allowed THEN
    RETURN NULL;
  END IF;

  NEW.company_name := SUBSTRING(COALESCE(NEW.company_name, '') FROM 1 FOR 120);
  NEW.role_target  := SUBSTRING(COALESCE(NEW.role_target, '')  FROM 1 FOR 120);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_visit_log_insert ON public.visit_logs;
CREATE TRIGGER guard_visit_log_insert
  BEFORE INSERT ON public.visit_logs
  FOR EACH ROW EXECUTE FUNCTION public.guard_visit_log_insert();
