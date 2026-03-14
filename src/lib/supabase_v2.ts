import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://fjmcjsffeycwygicflfk.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbWNqc2ZmZXljd3lpZ2ljZmxmayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5Njk1MjU3LCJleHAiOjIwODUyNzEyNTd9.GhQ9vE3KkA73nCXATFQtQCQIVdowXpK6utCWoG-4T-Y";

let supabaseInstance: any = null;

export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    if (!supabaseInstance) {
      if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_KEY.length < 10) {
        console.error("FATAL: Missing or invalid Supabase API Key. Identity Vault connection rejected.");
        throw new Error("Missing API Key");
      }

      try {
        supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: {
            storage: typeof window !== 'undefined' ? localStorage : undefined,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
          global: {
            headers: { 'x-application-name': 'foliogen' },
          },
        });
      } catch (e) {
        console.error("CRITICAL: Supabase v2 primary initialization failed. Retrying with emergency fallback...", e);
        // Retry with hardcoded fallback if initialization fails
        supabaseInstance = createClient("https://fjmcjsffeycwygicflfk.supabase.co", SUPABASE_KEY, {
          auth: {
            storage: typeof window !== 'undefined' ? localStorage : undefined,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
          global: {
            headers: { 'x-application-name': 'foliogen-v2-fallback' },
          },
        });
      }
    }
    return supabaseInstance[prop];
  }
});
