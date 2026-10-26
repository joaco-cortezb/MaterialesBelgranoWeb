import "server-only";

import { createClient } from "@supabase/supabase-js";
import { env, supabaseConfigured } from "@/lib/env";

/**
 * Anon key + RLS: lectura del contenido público e INSERT de clics a WhatsApp.
 * La web no usa la service role (no la necesita ni debe tenerla).
 */
export function getSupabaseClient() {
  if (!supabaseConfigured()) return null;

  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
