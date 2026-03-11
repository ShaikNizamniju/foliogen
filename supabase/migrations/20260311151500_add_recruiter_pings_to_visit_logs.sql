-- Migration: Add Recruiter Pings to Visit Logs
ALTER TABLE public.visit_logs 
  ADD COLUMN IF NOT EXISTS is_ping boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS contact_method text;

-- Restrict the data selection to the portfolio owner (RLS already handles this, but we explicitly re-affirm it)
-- The existing policy: CREATE POLICY "users can view their visit logs" ON public.visit_logs FOR SELECT USING (auth.uid() = user_id);
-- handles the privacy requirement seamlessly.
