import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Correct production credentials for this Lovable Cloud project.
// We read from Vite env first, then fall back to the canonical hardcoded
// values so the app never points at a dead Supabase domain.
const FALLBACK_URL = "https://abcrgpmwoqsfwtmliqwo.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY3JncG13b3FzZnd0bWxpcXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTUyNTcsImV4cCI6MjA4NTI3MTI1N30.GhQ9vE3KkA73nCXATFQtQCQIVdowXpK6utCWoG-4T-Y";

const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const envKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim();

// Guard against the historical dead placeholder ref ending up anywhere.
const BAD_REF = "fjmcjsffeycwygicflfk";
const safeUrl =
  envUrl && /^https:\/\/[a-z0-9]+\.supabase\.co\/?$/i.test(envUrl) && !envUrl.includes(BAD_REF)
    ? envUrl.replace(/\/$/, "")
    : FALLBACK_URL;
const safeKey = envKey && envKey.length > 60 ? envKey : FALLBACK_KEY;

export const SUPABASE_URL = safeUrl;
export const SUPABASE_KEY = safeKey;
export const isSupabaseConfigValid = !safeUrl.includes(BAD_REF) && safeUrl.startsWith("https://");

let supabaseInstance: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get: (_t, prop: string) => {
    if (!supabaseInstance) {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          storage: typeof window !== "undefined" ? localStorage : undefined,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    }
    return (supabaseInstance as any)[prop];
  },
});
