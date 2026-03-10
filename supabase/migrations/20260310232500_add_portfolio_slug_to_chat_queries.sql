-- Add portfolio_slug column to chat_queries to support multi-instance Identity Vault
ALTER TABLE public.chat_queries ADD COLUMN IF NOT EXISTS portfolio_slug text DEFAULT 'default';
