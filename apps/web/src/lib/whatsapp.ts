import { findRubro, ROUTES, WHATSAPP_SOURCE_LABELS, type WhatsappSource } from "@mb/shared";

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

/** Origen de un rubro, tipado. */
export function rubroWhatsappSource(slug: string): WhatsappSource {
  return `rubro_${slug}` as WhatsappSource;
}

/** Texto que se adjunta al mensaje para que el vendedor sepa de qué página viene. */
export function whatsappPageLabel(source: WhatsappSource): string {
  if (source.startsWith("rubro_")) {
    const rubro = findRubro(source.slice("rubro_".length));
    return rubro ? rubro.name : WHATSAPP_SOURCE_LABELS[source];
  }
  return WHATSAPP_SOURCE_LABELS[source];
}

/** A dónde volver si el origen o el número no existen. */
export const WHATSAPP_FALLBACK_PATH = ROUTES.contacto;
