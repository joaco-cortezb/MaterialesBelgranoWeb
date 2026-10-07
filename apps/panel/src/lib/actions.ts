import "server-only";

import { headers } from "next/headers";
import { databaseConfigured, supabaseConfigured } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** Resultado uniforme de los server actions del panel. */
export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export function ok(message?: string): ActionResult {
  return { ok: true, message };
}

export function fail(error: string): ActionResult {
  return { ok: false, error };
}

/** Devuelve un error si el panel no está configurado (protege las escrituras). */
export function assertConfigured(): { ok: false; error: string } | null {
  if (!supabaseConfigured() || !databaseConfigured()) {
    return fail("El panel todavía no está conectado a Supabase. Completá las variables de entorno.") as {
      ok: false;
      error: string;
    };
  }
  return null;
}

export async function assertMutationAllowed(scope: string): Promise<ActionResult | null> {
  const requestHeaders = await headers();
  const limited = await rateLimit({
    key: `panel-mutation:${scope}:${clientIp(requestHeaders)}`,
    limit: 60,
    windowMs: 60_000,
  });
  if (!limited.ok) return fail("Demasiadas acciones en poco tiempo. Esperá un minuto e intentá de nuevo.");
  return null;
}

/** Primer mensaje de error de un `safeParse` de zod. */
export function firstIssue(error: { issues: Array<{ message: string }> }): string {
  return error.issues[0]?.message ?? "Datos inválidos";
}
