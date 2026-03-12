-- ────────────────────────────────────────────────────────────────────────────────
-- Database Webhook Trigger: notify-lead-ping
-- Fires on every INSERT into visit_logs where is_ping = TRUE.
-- Calls the Edge Function via pg_net to keep latency < 200ms.
-- ────────────────────────────────────────────────────────────────────────────────

-- Step 1: Enable pg_net extension (for async HTTP calls from within PostgreSQL)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Step 2: Create the trigger function
CREATE OR REPLACE FUNCTION public.notify_lead_ping()
RETURNS TRIGGER AS $$
DECLARE
  edge_url text;
  payload jsonb;
BEGIN
  -- Only fire for actual pings
  IF NEW.is_ping IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  -- Build the Supabase Edge Function URL
  edge_url := (
    SELECT decrypted_secret 
    FROM vault.decrypted_secrets 
    WHERE name = 'SUPABASE_URL' 
    LIMIT 1
  );

  -- Fallback to env if vault unavailable
  IF edge_url IS NULL THEN
    edge_url := current_setting('app.settings.supabase_url', true);
  END IF;

  -- If we still don't have a URL, use the project URL directly
  IF edge_url IS NULL OR edge_url = '' THEN
    edge_url := 'https://fjmcjsffeycwyigicflfk.supabase.co';
  END IF;

  edge_url := edge_url || '/functions/v1/notify-lead-ping';

  -- Build payload from the new row
  payload := jsonb_build_object(
    'record', jsonb_build_object(
      'id', NEW.id,
      'user_id', NEW.user_id,
      'link_type', NEW.link_type,
      'link_id', NEW.link_id,
      'industry_context', NEW.industry_context,
      'device_type', NEW.device_type,
      'is_ping', NEW.is_ping,
      'company', NEW.company,
      'contact_method', NEW.contact_method,
      'created_at', NEW.created_at
    )
  );

  -- Fire-and-forget HTTP POST via pg_net (non-blocking, < 200ms)
  PERFORM net.http_post(
    url := edge_url,
    body := payload::text,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    )
  );

  -- Always return NEW so the INSERT is never blocked
  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- Silent failure: log but never block the insert
  RAISE WARNING 'notify_lead_ping trigger failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create the trigger on the visit_logs table
DROP TRIGGER IF EXISTS trg_notify_lead_ping ON public.visit_logs;

CREATE TRIGGER trg_notify_lead_ping
  AFTER INSERT ON public.visit_logs
  FOR EACH ROW
  WHEN (NEW.is_ping = TRUE)
  EXECUTE FUNCTION public.notify_lead_ping();
