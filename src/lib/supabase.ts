import { createClient } from "@supabase/supabase-js";
// Hardcoding strings as a final-stand production fix
const URL = "https://fjmcjsffeycwygicflfk.supabase.co";
const KEY = "sb_publishable_yzi4UYRXIdUg0ANPxexWGg_T5Ccg9wK";
export const supabase = createClient(URL, KEY);
