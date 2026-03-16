-- Add narrative variants and active persona to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS narrative_variants jsonb DEFAULT '{
  "general": {"bio": "", "headline": ""},
  "startup": {"bio": "", "headline": ""},
  "bigtech": {"bio": "", "headline": ""},
  "fintech": {"bio": "", "headline": ""}
}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_persona text DEFAULT 'general';
