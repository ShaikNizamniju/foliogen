import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fjmcjsffeycwygicflfk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbWNqc2ZmZXljd3lnaWNmbGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzA0MjYsImV4cCI6MjA4NTYwNjQyNn0.blzGaOlPRVyM90RWoA7tshfGBXFPdkY6XWaspMdOou8";

let supabaseInstance: any = null;

export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    if (!supabaseInstance) {
      try {
        supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: {
            storage: typeof window !== 'undefined' ? localStorage : undefined,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          }
        });
      } catch (e) {
        console.error("CRITICAL: Supabase manual override initialization failed.", e);
        // Direct creation as absolute fallback
        supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: {
            persistSession: true,
          }
        });
      }
    }
    return supabaseInstance[prop];
  }
});
