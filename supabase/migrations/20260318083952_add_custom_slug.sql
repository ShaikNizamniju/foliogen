ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS custom_slug text UNIQUE;
CREATE UNIQUE INDEX IF NOT EXISTS portfolios_custom_slug_idx ON portfolios(custom_slug);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS font_config jsonb DEFAULT '{}'::jsonb;
