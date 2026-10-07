import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { composeWhatsappMessage, findRubro, isWhatsappSource, whatsappUrl } from "@mb/shared";
import { getDefaultWhatsapp, getWhatsappNumbers } from "@/lib/cms";
import { env } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { WHATSAPP_FALLBACK_PATH, whatsappPageLabel } from "@/lib/whatsapp";

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|headless/i;

/**
 * Redirección a WhatsApp que cuenta el clic. Es una ruta (y no un link
 * directo) para que el contador del panel funcione sin JavaScript ni
 * consentimiento de cookies. Los bots no se cuentan.
 */
export async function GET(request: Request, context: RouteContext<"/go/whatsapp/[source]">) {
  const { source } = await context.params;
  if (!isWhatsappSource(source)) {
    return NextResponse.redirect(new URL(WHATSAPP_FALLBACK_PATH, request.url));
  }

  const requestedId = new URL(request.url).searchParams.get("n");
  const numbers = await getWhatsappNumbers();
  const number = (requestedId && numbers.find((item) => item.id === requestedId)) || (await getDefaultWhatsapp());

  const rubro = source.startsWith("rubro_") ? findRubro(source.slice("rubro_".length)) : undefined;
  const message = rubro ? rubro.whatsappMessage : composeWhatsappMessage(number.message, whatsappPageLabel(source));

  await recordClick(request, source, number.id);

  return NextResponse.redirect(whatsappUrl(number.phone, message), 302);
}

async function recordClick(request: Request, source: string, numberId: string) {
  const ip = clientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "";
  if (ip === "unknown" || BOT_UA.test(userAgent)) return;

  // Varios clics seguidos de la misma persona cuentan una vez por minuto.
  const limited = await rateLimit({ key: `wa:${ip}:${source}`, limit: 1, windowMs: 60_000 });
  if (!limited.ok) return;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  // Hash irreversible: sirve para deduplicar sin guardar la IP.
  const visitorHash = createHash("sha256").update(`${ip}|${userAgent}|${env.SUPABASE_SERVICE_ROLE_KEY}`).digest("hex").slice(0, 32);
  const { error } = await supabase.from("WhatsappClick").insert({
    id: crypto.randomUUID(),
    source,
    numberId: numberId === "fallback" ? null : numberId,
    visitorHash,
    referrer: request.headers.get("referer"),
  });
  if (error) console.error("[go/whatsapp] no se pudo registrar el clic", { source, code: error.code });
}
