-- Up Migration
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS status text DEFAULT 'published';

-- Update RLS on portfolios table
DROP POLICY IF EXISTS "Portfolios are viewable by everyone." ON public.portfolios;

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
ALTER TABLE public.visit_logs 
ALTER COLUMN industry_context SET DEFAULT 'AI_PM_Vertical';

UPDATE public.visit_logs 
SET industry_context = 'AI_PM_Vertical' 
WHERE industry_context IS NULL OR industry_context = 'none';

-- End
