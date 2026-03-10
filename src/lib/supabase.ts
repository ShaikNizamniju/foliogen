import { createClient } from "@supabase/supabase-js";
// Hardcoding strings as a final-stand production fix
const URL = "https://fjmcjsffeycwygicflfk.supabase.co";
const KEY = "sb_publishable_yzi4UYRXIdUg0ANPxexWGg_T5Ccg9wK";

let clientInstance;
try {
    if (!URL || URL.trim() === '') throw new Error('Missing Supabase URL');
    clientInstance = createClient(URL, KEY);
} catch (error) {
    console.error("Supabase initialization failed:", error);
    if (typeof document !== 'undefined') {
        document.body.innerHTML = `
      <div style="background: black; color: white; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 24px;">
        System Restoring...
      </div>
    `;
    }
}
export const supabase = clientInstance as any;
