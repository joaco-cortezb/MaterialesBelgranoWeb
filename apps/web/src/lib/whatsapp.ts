import { ROUTES, rubroWhatsappSource, whatsappSourceLabel, type WhatsappSource } from "@mb/shared";

/**
 * Todos los CTA a WhatsApp apuntan a `/go/whatsapp/<origen>`: la ruta cuenta
 * el clic en la base y redirige a `wa.me`. Así el contador del panel funciona
 * sin JavaScript ni consentimiento de cookies; GA4 se mide aparte en el
 * `onClick` (ver `TrackedLink`).
 */
export function whatsappGoHref(source: WhatsappSource, numberId?: string): string {
  const base = `/go/whatsapp/${source}`;
  return numberId ? `${base}?n=${encodeURIComponent(numberId)}` : base;
}

export { rubroWhatsappSource };

/** Texto que se adjunta al mensaje para que el vendedor sepa de qué página viene. */
export function whatsappPageLabel(source: WhatsappSource, categoryName?: string): string {
  if (categoryName) return categoryName;
  return whatsappSourceLabel(source);
}

/** A dónde volver si el origen o el número no existen. */
export const WHATSAPP_FALLBACK_PATH = ROUTES.contacto;
