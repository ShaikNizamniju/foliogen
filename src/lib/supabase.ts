
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '[PASTE YOUR SUPABASE PROJECT URL HERE]';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '[PASTE YOUR ANON PUBLIC KEY HERE]';

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error('Supabase initialization failed: VITE_SUPABASE_URL is undefined. Returning null client.');
}

export const supabase = import.meta.env.VITE_SUPABASE_URL
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;
