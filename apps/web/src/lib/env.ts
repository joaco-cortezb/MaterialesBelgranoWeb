import "server-only";

/**
 * Acceso centralizado a variables de entorno. El sitio tiene que COMPILAR y
 * correr aunque falten credenciales reales: por eso no se valida en el import,
 * sino con helpers `*Configured()` que detectan placeholders.
 */
const PLACEHOLDER_HINTS = ["placeholder", "cambiame"];

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const normalized = value.toLowerCase();
  return PLACEHOLDER_HINTS.some((hint) => normalized.includes(hint));
}

export const env = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET ?? "",
  SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    "",
} as const;

export function supabaseConfigured(): boolean {
  return (
    env.SUPABASE_URL.startsWith("https://") &&
    !isPlaceholder(env.SUPABASE_URL) &&
    !isPlaceholder(env.SUPABASE_ANON_KEY)
  );
}

export function supabaseAdminConfigured(): boolean {
  return supabaseConfigured() && !isPlaceholder(env.SUPABASE_SERVICE_ROLE_KEY);
}

export function revalidateConfigured(): boolean {
  return !isPlaceholder(env.REVALIDATE_SECRET);
}
