-- Add key_highlights column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS key_highlights text[] DEFAULT '{}';