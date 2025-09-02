// src/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = "https://nwgopjqgwdbmbwzctads.supabase.co";
const supabaseAnonKey: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z29wanFnd2RibWJ3emN0YWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDAwMDcsImV4cCI6MjA2ODA3NjAwN30.cd57Ldr86E44SkY77UdhKxY891BD-fltAC2mgcAcH_c";

if (!supabaseUrl || supabaseUrl === "https://nwgopjqgwdbmbwzctads.supabase.co" || 
    !supabaseAnonKey || supabaseAnonKey === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z29wanFnd2RibWJ3emN0YWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDAwMDcsImV4cCI6MjA2ODA3NjAwN30.cd57Ldr86E44SkY77UdhKxY891BD-fltAC2mgcAcH_c") {
  console.warn("⚠️  SUPABASE SETUP REQUIRED: Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations (if needed)
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z29wanFnd2RibWJ3emN0YWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDAwMDcsImV4cCI6MjA2ODA3NjAwN30.cd57Ldr86E44SkY77UdhKxY891BD-fltAC2mgcAcH_c";
export const supabaseAdmin = supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }) : null;
