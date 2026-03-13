import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://fjmcjsffeycwyigicflfk.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbWNqc2ZmZXljd3lpZ2ljZmxmayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5Njk1MjU3LCJleHAiOjIwODUyNzEyNTd9.GhQ9vE3KkA73nCXATFQtQCQIVdowXpK6utCWoG-4T-Y";

if (!supabaseUrl || supabaseUrl === "undefined") {
  throw new Error("CRITICAL: Supabase connection string is missing. Verify VITE_SUPABASE_URL.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
