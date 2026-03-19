-- Up Migration
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='status') THEN ALTER TABLE public.portfolios ADD COLUMN status text DEFAULT 'published'; END IF; END$$;

-- Update RLS on portfolios table
DROP POLICY IF EXISTS "Portfolios are viewable by everyone." ON public.portfolios;

DROP POLICY IF EXISTS "Portfolios are viewable by everyone if published" ON public.portfolios;
CREATE POLICY "Portfolios are viewable by everyone if published" ON public.portfolios
FOR SELECT USING (
  status = 'published' 
  OR 
  (status = 'draft' AND EXISTS (
    SELECT 1 FROM chameleon_links cl 
    WHERE cl.user_id = portfolios.user_id AND cl.is_active = true
  ))
  OR 
  (user_id = auth.uid())
);

-- Modify visit_logs to set default industry_context or backfill existing records
ALTER TABLE public.visit_logs ALTER COLUMN industry_context SET DEFAULT 'AI_PM_Vertical';

UPDATE public.visit_logs 
SET industry_context = 'AI_PM_Vertical' 
WHERE industry_context IS NULL OR industry_context = 'none';

-- End
