/**
 * Contrato panel ↔ web.
 *
 * - `CMS_TAGS`: tags de `unstable_cache` de la web. El panel manda uno de
 *   estos al webhook `/api/revalidate` después de cada escritura.
 * - `SETTING_KEYS`: claves de la tabla `Setting` (clave-valor JSON) que la web
 *   puede leer. La policy RLS de `Setting` repite esta lista.
 * - `WHATSAPP_SOURCES`: orígenes válidos de un clic a WhatsApp. Se usan en la
 *   URL `/go/whatsapp/[source]`, en el evento de GA4 y en el contador del panel.
 */
export const CMS_TAGS = ["brands", "images", "whatsapp", "settings"] as const;
export type CmsTag = (typeof CMS_TAGS)[number];

export const SETTING_KEYS = {
  homeVideoUrl: "home.videoUrl",
  aboutHeadline: "about.headline",
  aboutBody: "about.body",
} as const;
export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];
export const PUBLIC_SETTING_KEYS: readonly SettingKey[] = Object.values(SETTING_KEYS);

export const WHATSAPP_SOURCES = [
  "header",
  "flotante",
  "inicio",
  "nosotros",
  "servicios",
  "marcas",
  "contacto",
  "rubro_materiales-electricos",
  "rubro_iluminacion",
  "rubro_maquinas-y-herramientas",
  "rubro_dispositivos-smart",
  "rubro_camaras-y-videovigilancia",
  "404",
] as const;
export type WhatsappSource = (typeof WHATSAPP_SOURCES)[number];

export function isWhatsappSource(value: string): value is WhatsappSource {
  return (WHATSAPP_SOURCES as readonly string[]).includes(value);
}

/** Etiquetas legibles para el panel de métricas. */
export const WHATSAPP_SOURCE_LABELS: Record<WhatsappSource, string> = {
  header: "Menú",
  flotante: "Botón flotante",
  inicio: "Inicio",
  nosotros: "Nosotros",
  servicios: "Servicios",
  marcas: "Marcas",
  contacto: "Contacto",
  "rubro_materiales-electricos": "Solución: materiales eléctricos",
  "rubro_iluminacion": "Solución: iluminación",
  "rubro_maquinas-y-herramientas": "Solución: máquinas y herramientas",
  "rubro_dispositivos-smart": "Solución: dispositivos smart",
  "rubro_camaras-y-videovigilancia": "Solución: cámaras",
  "404": "Página no encontrada",
};
