DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='custom_slug') THEN ALTER TABLE portfolios ADD COLUMN custom_slug text UNIQUE; END IF; END$$;
CREATE UNIQUE INDEX IF NOT EXISTS portfolios_custom_slug_idx ON portfolios(custom_slug);
DO $$BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='font_config') THEN ALTER TABLE profiles ADD COLUMN font_config jsonb DEFAULT '{}'::jsonb; END IF; END$$;
