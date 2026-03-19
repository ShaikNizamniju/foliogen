-- Add narrative variants and active persona to profiles
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='narrative_variants') THEN ALTER TABLE public.profiles ADD COLUMN narrative_variants jsonb DEFAULT '{
  "general": {"bio": ""; END IF; END$$;
ALTER TABLE public.profiles "headline": ""};
ALTER TABLE public.profiles "startup": {"bio": "";
ALTER TABLE public.profiles "headline": ""};
ALTER TABLE public.profiles "bigtech": {"bio": "";
ALTER TABLE public.profiles "headline": ""};
ALTER TABLE public.profiles "fintech": {"bio": "";
ALTER TABLE public.profiles "headline": ""}
}'::jsonb;
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='active_persona') THEN ALTER TABLE public.profiles ADD COLUMN active_persona text DEFAULT 'general'; END IF; END$$;
