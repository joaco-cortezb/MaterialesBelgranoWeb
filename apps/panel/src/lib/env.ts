/**
 * Acceso centralizado a variables de entorno. El panel tiene que COMPILAR y
 * correr aunque falten credenciales reales: no se valida en el import, sino
 * con helpers `*Configured()` que detectan placeholders.
 */
const PLACEHOLDER_HINTS = ["placeholder", "cambiame"];

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const normalized = value.toLowerCase();
  return PLACEHOLDER_HINTS.some((hint) => normalized.includes(hint));
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  SUPABASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "media",
  PUBLIC_WEB_URL: (process.env.PUBLIC_WEB_URL ?? "https://materialesbelgrano.com").replace(/\/$/, ""),
  PANEL_URL: process.env.PANEL_URL ?? "http://localhost:3001",
  REVALIDATE_WEBHOOK_URL: process.env.REVALIDATE_WEBHOOK_URL ?? "",
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET ?? "",
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

export function databaseConfigured(): boolean {
  return env.DATABASE_URL.startsWith("postgres") && !isPlaceholder(env.DATABASE_URL);
}

export function revalidateConfigured(): boolean {
  return (
    !isPlaceholder(env.REVALIDATE_SECRET) &&
    (env.REVALIDATE_WEBHOOK_URL.startsWith("http") || env.PUBLIC_WEB_URL.startsWith("http"))
  );
}
