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

/**
 * Corre una escritura y, si la base falla (o el registro ya no existe),
 * devuelve un error legible en vez de romper la acción.
 */
export async function attempt(write: () => Promise<unknown>, errorMessage: string): Promise<ActionResult | null> {
  try {
    await write();
    return null;
  } catch (error) {
    console.error(errorMessage, error);
    return fail(errorMessage);
  }
}

/**
 * Nuevo orden de una lista al mover `id` un lugar (`dir`). Devuelve los ids en
 * el orden final, o `null` si no hay nada que mover. Renumerar toda la lista
 * evita que dos ítems con el mismo `order` queden trabados.
 */
export function moveInList(ids: string[], id: string, dir: -1 | 1): string[] | null {
  const index = ids.indexOf(id);
  const swap = index + dir;
  if (index < 0 || swap < 0 || swap >= ids.length) return null;
  const next = [...ids];
  [next[index], next[swap]] = [next[swap], next[index]];
  return next;
}
