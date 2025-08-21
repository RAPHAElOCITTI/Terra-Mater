// src/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || "https://your-project-ref.supabase.co";
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key-here";

if (!supabaseUrl || supabaseUrl === "https://your-project-ref.supabase.co" || 
    !supabaseAnonKey || supabaseAnonKey === "your-anon-key-here") {
  console.warn("⚠️  SUPABASE SETUP REQUIRED: Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations (if needed)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }) : null;
