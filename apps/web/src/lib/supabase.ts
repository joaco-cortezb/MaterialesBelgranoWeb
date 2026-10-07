import "server-only";

import { createClient } from "@supabase/supabase-js";
import { env, supabaseAdminConfigured, supabaseConfigured } from "@/lib/env";

/** Lectura pública: anon key + RLS. Sin sesión, sin refresh. */
export function getSupabaseClient() {
  if (!supabaseConfigured()) return null;

  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Escrituras puntuales del server (clics a WhatsApp). Nunca en el cliente. */
export function getSupabaseAdminClient() {
  if (!supabaseAdminConfigured()) return null;

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
