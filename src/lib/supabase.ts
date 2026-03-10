
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fjmcjsffeycwygicflfk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yzi4UYRXIdUg0ANPxexWGg_T5Ccg9wK';

// We bypass the env check entirely and initialize the client using the hardcoded fallbacks.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
