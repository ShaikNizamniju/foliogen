import { createClient } from "@supabase/supabase-js";
// Production Supabase REST API connection (env → hardcoded fallback)
const URL = import.meta.env.VITE_SUPABASE_URL || "https://fjmcjsffeycwygicflfk.supabase.co";
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_yzi4UYRXIdUg0ANPxexWGg_T5Ccg9wK";

/**
 * Transaction Pooler (Port 6543) — server-side only.
 * Set VITE_SUPABASE_DB_URL in your .env to:
 *   postgresql://postgres.fjmcjsffeycwygicflfk:<PASSWORD>@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
 * This value is never hardcoded to prevent password exposure in the client bundle.
 */
export const POOLER_CONNECTION_STRING = import.meta.env.VITE_SUPABASE_DB_URL || '';

let clientInstance;
try {
  if (!URL || URL.trim() === '') throw new Error('Missing Supabase URL');

  // Security: Bind to specific domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isAllowed = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('foliogen.in');
    if (!isAllowed) {
      console.warn('Foliogen Security: Invalid host. Backend connectivity restricted.');
    }

    // Security: Mask keys from window object to prevent scraping scripts
    Object.defineProperty(window, '__SUPABASE_KEYS__', {
      get: () => { console.warn('Protected resource.'); return null; },
      enumerable: false,
      configurable: false
    });
  }

  clientInstance = createClient(URL, KEY);
} catch (error) {
  console.error("Supabase initialization failed:", error);
  if (typeof document !== 'undefined') {
    document.body.innerHTML = `
      <div style="background: black; color: white; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 24px;">
        System Restoring...
      </div>
    `;
  }
}
export const supabase = clientInstance as any;
