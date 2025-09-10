// src/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || supabaseUrl === import.meta.env.VITE_SUPABASE_URL || 
    !supabaseAnonKey || supabaseAnonKey === import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("⚠️  SUPABASE SETUP REQUIRED: Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations (if needed)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
export const supabaseAdmin = supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }) : null;
