import { createClient } from "@supabase/supabase-js";

// Production Lovable Cloud Supabase connection
const URL = import.meta.env.VITE_SUPABASE_URL || "https://fjmcjsffeycwyigicflfk.supabase.co";
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbWNqc2ZmZXljd3lpZ2ljZmxmayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5Njk1MjU3LCJleHAiOjIwODUyNzEyNTd9.GhQ9vE3KkA73nCXATFQtQCQIVdowXpK6utCWoG-4T-Y";

export const supabase = createClient(URL, KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
