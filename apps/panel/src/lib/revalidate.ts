import "server-only";

import { after } from "next/server";
import type { CmsTag } from "@mb/shared";
import { env, revalidateConfigured } from "@/lib/env";

type RevalidateOptions = {
  /**
   * Pedirle a la web que precaliente las imágenes. Sólo cuando se creó o cambió
   * la URL de una imagen: reordenar, ocultar o borrar no lo necesitan.
   */
  warm?: boolean;
};

/**
 * Notifica a la WEB PÚBLICA que revalide su cache. Única comunicación
 * panel → web. Corre con `after()`: la acción responde enseguida y el webhook
 * (con sus reintentos) sigue después. Con varios tags, el precalentado se pide
 * una sola vez (en el último). Si el webhook no está configurado, sólo loguea.
 */
export function revalidateWeb(tags: CmsTag | CmsTag[], options: RevalidateOptions = {}): void {
  const list = Array.isArray(tags) ? tags : [tags];
  after(async () => {
    for (const [index, tag] of list.entries()) {
      await notifyWeb(tag, options.warm === true && index === list.length - 1);
    }
  });
}

async function notifyWeb(tag: CmsTag, warm: boolean): Promise<void> {
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
        body: JSON.stringify(warm ? { tag, warm: true } : { tag }),
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
