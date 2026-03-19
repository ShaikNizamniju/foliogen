-- Add portfolio_slug column to chat_queries to support multi-instance Identity Vault
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_queries' AND column_name='portfolio_slug') THEN ALTER TABLE public.chat_queries ADD COLUMN portfolio_slug text DEFAULT 'default'; END IF; END$$;
