-- ════════════════════════════════════════════════════════════════════════════════
-- SECURITY LOCKDOWN: Enable RLS & enforce auth.uid() policies on all flagged tables.
-- Phase 3.6 — Supabase Security Advisor remediation.
-- ════════════════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────
-- 1. ENABLE ROW LEVEL SECURITY
-- ────────────────────────────────────────
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────
-- 2. agent_memory — Users own their data
-- ────────────────────────────────────────
DROP POLICY IF EXISTS "Users can select own agent_memory" ON public.agent_memory;
CREATE POLICY "Users can select own agent_memory" ON public.agent_memory
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own agent_memory" ON public.agent_memory;
CREATE POLICY "Users can insert own agent_memory" ON public.agent_memory
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own agent_memory" ON public.agent_memory;
CREATE POLICY "Users can update own agent_memory" ON public.agent_memory
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own agent_memory" ON public.agent_memory;
CREATE POLICY "Users can delete own agent_memory" ON public.agent_memory
    FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────
-- 3. job_applications — Users own their data
-- ────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own job_applications" ON public.job_applications;
CREATE POLICY "Users can manage own job_applications" ON public.job_applications
    FOR ALL USING (auth.uid() = user_id);

-- ────────────────────────────────────────
-- 4. transactions — LOCKED. Service-role only for writes.
--    Users can only READ their own transactions.
-- ────────────────────────────────────────
DROP POLICY IF EXISTS "Users can select own transactions" ON public.transactions;
CREATE POLICY "Users can select own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for authenticated users.
-- Only the service_role (Edge Functions) can write to this table.

-- ────────────────────────────────────────
-- 5. calendar_events — Users own their data
-- ────────────────────────────────────────
DROP POLICY IF EXISTS "Users can select own calendar_events" ON public.calendar_events;
CREATE POLICY "Users can select own calendar_events" ON public.calendar_events
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own calendar_events" ON public.calendar_events;
CREATE POLICY "Users can insert own calendar_events" ON public.calendar_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own calendar_events" ON public.calendar_events;
CREATE POLICY "Users can update own calendar_events" ON public.calendar_events
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own calendar_events" ON public.calendar_events;
CREATE POLICY "Users can delete own calendar_events" ON public.calendar_events
    FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────
-- 6. rate_limits — Users can only read their own rate limits.
--    Inserts/updates handled by service-role triggers.
-- ────────────────────────────────────────
DROP POLICY IF EXISTS "Users can select own rate_limits" ON public.rate_limits;
CREATE POLICY "Users can select own rate_limits" ON public.rate_limits
    FOR SELECT USING (auth.uid() = user_id);
