"use client";

/**
 * Eventos a GA4 vía `dataLayer` (GTM). Si el contenedor no está cargado, el
 * push queda en el array y GTM lo procesa al iniciar; si nunca carga, no pasa
 * nada. Nunca se mandan datos personales: el payload se filtra por claves.
 */
type EventParams = Record<string, string | number | boolean | undefined>;

const PII_KEYS = /email|phone|telefono|whatsapp_number|dni|cuit|nombre|name|address|direccion/i;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function trackEvent(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  for (const key of Object.keys(params)) {
    if (PII_KEYS.test(key)) {
      console.warn(`[gtm] evento "${event}" descartado: la clave "${key}" parece dato personal`);
      return;
    }
  }
  window.dataLayer ??= [];
  window.dataLayer.push({ event, ...params });
}
