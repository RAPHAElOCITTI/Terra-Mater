// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
var supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || supabaseUrl === import.meta.env.VITE_SUPABASE_URL ||
    !supabaseAnonKey || supabaseAnonKey === import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn("⚠️  SUPABASE SETUP REQUIRED: Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file");
}
export var supabase = createClient(supabaseUrl, supabaseAnonKey);
// For server-side operations (if needed)
var supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
export var supabaseAdmin = supabaseServiceKey ?
    createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }) : null;
