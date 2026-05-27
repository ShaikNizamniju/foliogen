import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const FALLBACK_URL = 'https://abcrgpmwoqsfwtmliqwo.supabase.co';
const FALLBACK_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY3JncG13b3FzZnd0bWxpcXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTUyNTcsImV4cCI6MjA4NTI3MTI1N30.GhQ9vE3KkA73nCXATFQtQCQIVdowXpK6utCWoG-4T-Y';

const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const envKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim();

const BAD_REF = 'fjmcjsffeycwygicflfk';
const SUPABASE_URL =
  envUrl && /^https:\/\/[a-z0-9]+\.supabase\.co\/?$/i.test(envUrl) && !envUrl.includes(BAD_REF)
    ? envUrl.replace(/\/$/, '')
    : FALLBACK_URL;
const SUPABASE_KEY = envKey && envKey.length > 60 ? envKey : FALLBACK_KEY;

let supabaseInstance: any = null;

export const supabase = new Proxy({} as any, {
  get: (_target, prop) => {
    if (!supabaseInstance) {
      supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          storage: typeof window !== 'undefined' ? localStorage : undefined,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    }
    return supabaseInstance[prop];
  },
});
