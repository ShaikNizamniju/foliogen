-- Migration: Add Recruiter Pings to Visit Logs
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='visit_logs' AND column_name='is_ping') THEN ALTER TABLE public.visit_logs ADD COLUMN is_ping boolean DEFAULT false; END IF; END$$;
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='visit_logs' AND column_name='company') THEN ALTER TABLE public.visit_logs ADD COLUMN company text; END IF; END$$;
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='visit_logs' AND column_name='contact_method') THEN ALTER TABLE public.visit_logs ADD COLUMN contact_method text; END IF; END$$;

-- Restrict the data selection to the portfolio owner (RLS already handles this, but we explicitly re-affirm it)
-- The existing policy: CREATE POLICY "users can view their visit logs" ON public.visit_logs FOR SELECT USING (auth.uid() = user_id);
-- handles the privacy requirement seamlessly.
