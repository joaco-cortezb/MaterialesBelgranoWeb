import { createHash, timingSafeEqual } from "node:crypto";
import { getSupabaseClient } from "@/lib/supabase";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Cron diario de Vercel (ver `vercel.json`): hace una consulta mínima a la
 * base para que Supabase no pause el proyecto por inactividad (plan gratuito:
 * ~7 días sin uso). Con la cache de la web, las visitas casi no llegan a la
 * base, así que sin esto el proyecto se pausa aunque el sitio tenga tráfico.
 *
 * Si `CRON_SECRET` está configurado, Vercel lo manda como Bearer y se exige.
 * Sin él la ruta igual es inocua: lee una fila pública y tiene rate limit.
 */
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization") ?? "";
  const supplied = createHash("sha256").update(header.replace(/^Bearer /, "")).digest();
  const expected = createHash("sha256").update(secret).digest();
  return header.startsWith("Bearer ") && timingSafeEqual(supplied, expected);
}

export async function GET(request: Request) {
  const limited = await rateLimit({ key: `keepalive:${clientIp(request.headers)}`, limit: 5, windowMs: 60_000 });
  if (!limited.ok) return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
  if (!authorized(request)) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseClient();
  if (!supabase) return Response.json({ ok: false, error: "Supabase no configurado" }, { status: 503 });

  const { error } = await supabase.from("Brand").select("id").limit(1);
  if (error) {
    console.error("[keepalive] la base no respondió", error.message);
    return Response.json({ ok: false, error: "db error" }, { status: 502 });
  }
  return Response.json({ ok: true, at: new Date().toISOString() });
}
