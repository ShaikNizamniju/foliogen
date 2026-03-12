import { createClient } from "@supabase/supabase-js";
<<<<<<< HEAD
// Production Supabase REST API connection (env → hardcoded fallback)
const URL = import.meta.env.VITE_SUPABASE_URL || "https://abcrgpmwoqsfwtmliqwo.supabase.co";
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_yzi4UYRXIdUg0ANPxexWGg_T5Ccg9wK";
=======
>>>>>>> 3bf792ec75ad13ae42a39375e4e5b69a2c503bd0

// Production Lovable Cloud Supabase connection
const URL = import.meta.env.VITE_SUPABASE_URL || "https://abcrgpmwoqsfwtmliqwo.supabase.co";
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY3JncG13b3FzZnd0bWxpcXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTUyNTcsImV4cCI6MjA4NTI3MTI1N30.GhQ9vE3KkA73nCXATFQtQCQIVdowXpK6utCWoG-4T-Y";

export const supabase = createClient(URL, KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
