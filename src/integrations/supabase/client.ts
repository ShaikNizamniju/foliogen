import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fjmcjsffeycwyigicflfk.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbWNqc2ZmZXljd3lpZ2ljZmxmayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5Njk1MjU3LCJleHAiOjIwODUyNzEyNTd9.GhQ9vE3KkA73nCXATFQtQCQIVdowXpK6utCWoG-4T-Y';

let supabaseInstance: any = null;

export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    if (!supabaseInstance) {
      try {
        supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
          auth: {
            storage: typeof window !== 'undefined' ? localStorage : undefined,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          }
        });
      } catch (e) {
        // Retry with hardcoded fallback if initialization fails
        supabaseInstance = createClient<Database>('https://fjmcjsffeycwyigicflfk.supabase.co', SUPABASE_KEY, {
          auth: {
            storage: typeof window !== 'undefined' ? localStorage : undefined,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          }
        });
      }
    }
    return supabaseInstance[prop];
  }
});