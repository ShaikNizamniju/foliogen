
-- 1. analytics_events: scope SELECT to authenticated role only
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.analytics_events;
CREATE POLICY "Users can view their own analytics"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_user_id);

-- 2. chat_queries: restrict SELECT to authenticated owners, restrict INSERT explicitly to service_role
DROP POLICY IF EXISTS "Users can view their own chat queries" ON public.chat_queries;
CREATE POLICY "Users can view their own chat queries"
  ON public.chat_queries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_user_id);

DROP POLICY IF EXISTS "Service role can insert chat queries" ON public.chat_queries;
CREATE POLICY "Service role can insert chat queries"
  ON public.chat_queries
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 3. visit_logs: scope SELECT to authenticated owners; require meaningful payload on anon insert
DROP POLICY IF EXISTS "Users can view their own visit logs" ON public.visit_logs;
CREATE POLICY "Users can view their own visit logs"
  ON public.visit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_user_id);

DROP POLICY IF EXISTS "Visit logs for published portfolios (anon)" ON public.visit_logs;
CREATE POLICY "Visit logs for published portfolios (anon)"
  ON public.visit_logs
  FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.user_id = visit_logs.profile_user_id)
    AND (
      (company_name IS NOT NULL AND length(btrim(company_name)) BETWEEN 1 AND 120)
      OR (role_target IS NOT NULL AND length(btrim(role_target)) BETWEEN 1 AND 120)
    )
  );

DROP POLICY IF EXISTS "Visit logs for published portfolios (auth)" ON public.visit_logs;
CREATE POLICY "Visit logs for published portfolios (auth)"
  ON public.visit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.user_id = visit_logs.profile_user_id)
    AND (
      (company_name IS NOT NULL AND length(btrim(company_name)) BETWEEN 1 AND 120)
      OR (role_target IS NOT NULL AND length(btrim(role_target)) BETWEEN 1 AND 120)
    )
  );
