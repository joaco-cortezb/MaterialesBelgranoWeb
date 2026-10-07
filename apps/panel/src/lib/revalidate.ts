import "server-only";

import type { CmsTag } from "@mb/shared";
import { env, revalidateConfigured } from "@/lib/env";

/**
 * Notifica a la WEB PÚBLICA que revalide su cache. Única comunicación
 * panel → web. Si el webhook no está configurado, no rompe: sólo loguea.
 */
export async function revalidateWeb(tag: CmsTag): Promise<void> {
  if (!revalidateConfigured()) {
    console.info(`[revalidate] webhook no configurado; se omite revalidación de "${tag}"`);
    return;
  }

  const webhookUrl = env.REVALIDATE_WEBHOOK_URL || `${env.PUBLIC_WEB_URL}/api/revalidate`;
  const attempts = 3;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.REVALIDATE_SECRET}` },
        body: JSON.stringify({ tag }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) return;

      const body = await res.text().catch(() => "");
      // 401/400 no se arreglan reintentando (secreto o tag mal configurados).
      const retryable = res.status >= 500 || res.status === 429;
      console.warn(`[revalidate] la web respondió ${res.status} para "${tag}" (intento ${attempt}/${attempts})${body ? `: ${body.slice(0, 240)}` : ""}`);
      if (!retryable) return;
    } catch (error) {
      console.warn(`[revalidate] no se pudo notificar a la web (intento ${attempt}/${attempts}):`, error);
    }
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
  }
  console.error(`[revalidate] la web NO pudo revalidar "${tag}" tras ${attempts} intentos; queda el TTL de cache.`);
}
