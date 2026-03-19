-- Create the identity_vault table to store Multivariate Trust Scores
CREATE TABLE IF NOT EXISTS public.identity_vault (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id uuid NOT NULL UNIQUE,
    proof_validation_score integer DEFAULT 0,
    metric_density_score integer DEFAULT 0,
    framework_alignment_score integer DEFAULT 0,
    composite_trust_score integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.identity_vault ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own identity vault" ON public.identity_vault;
CREATE POLICY "Users can view own identity vault" ON public.identity_vault
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own identity vault" ON public.identity_vault;
CREATE POLICY "Users can insert own identity vault" ON public.identity_vault
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Explicitly ban UPDATEs from authenticated users to prevent client-side spoofing.
-- The edge function uses service_role or trigger logic to update this.
DROP POLICY IF EXISTS "Users cannot arbitrarily update composite score" ON public.identity_vault;
CREATE POLICY "Users cannot arbitrarily update composite score" ON public.identity_vault
    FOR UPDATE USING (false);

DROP POLICY IF EXISTS "Users can delete own identity vault" ON public.identity_vault;
CREATE POLICY "Users can delete own identity vault" ON public.identity_vault
    FOR DELETE USING (auth.uid() = user_id);
