
UPDATE public.portfolios
SET data_json = jsonb_set(
  data_json,
  '{projects}',
  COALESCE(
    (SELECT jsonb_agg(proj - 'password') FROM jsonb_array_elements(data_json->'projects') proj),
    '[]'::jsonb
  )
)
WHERE data_json ? 'projects'
  AND jsonb_typeof(data_json->'projects') = 'array';

UPDATE public.chameleon_links
SET data_json = jsonb_set(
  data_json,
  '{projects}',
  COALESCE(
    (SELECT jsonb_agg(proj - 'password') FROM jsonb_array_elements(data_json->'projects') proj),
    '[]'::jsonb
  )
)
WHERE data_json ? 'projects'
  AND jsonb_typeof(data_json->'projects') = 'array';
