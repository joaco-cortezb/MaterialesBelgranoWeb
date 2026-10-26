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
export const CMS_TAGS = ["brands", "images", "whatsapp", "settings", "categories"] as const;
export type CmsTag = (typeof CMS_TAGS)[number];

export const SETTING_KEYS = {
  homeVideoUrl: "home.videoUrl",
  homeHeroTitle: "home.heroTitle",
  homeHeroText: "home.heroText",
  aboutHeadline: "about.headline",
  aboutBody: "about.body",
} as const;
export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];
export const PUBLIC_SETTING_KEYS: readonly SettingKey[] = Object.values(SETTING_KEYS);

/** Título de la portada del inicio si el panel no cargó uno. */
export const DEFAULT_HOME_HERO_TITLE = "Todo lo que tu obra necesita, en un solo lugar";

/** Bajada de la portada del inicio si el panel nunca guardó una (guardarla vacía la oculta). */
export const DEFAULT_HOME_HERO_TEXT =
  "Materiales eléctricos, iluminación, herramientas, cámaras y productos smart, con asesoramiento real y entrega rápida.";

/** Orígenes fijos. Las soluciones suman `rubro_<slug>` (se crean en el panel). */
export const WHATSAPP_SOURCES = ["header", "inicio", "nosotros", "servicios", "marcas", "contacto", "404"] as const;
type StaticWhatsappSource = (typeof WHATSAPP_SOURCES)[number];
export type WhatsappSource = StaticWhatsappSource | `rubro_${string}`;

const RUBRO_SOURCE = /^rubro_[a-z0-9-]{1,80}$/;

export function isWhatsappSource(value: string): value is WhatsappSource {
  return (WHATSAPP_SOURCES as readonly string[]).includes(value) || RUBRO_SOURCE.test(value);
}

export function rubroWhatsappSource(slug: string): WhatsappSource {
  return `rubro_${slug}`;
}

/** Slug de la solución si el origen es `rubro_<slug>`. */
export function rubroSlugFromSource(source: string): string | null {
  return RUBRO_SOURCE.test(source) ? source.slice("rubro_".length) : null;
}

const STATIC_SOURCE_LABELS: Record<StaticWhatsappSource, string> = {
  header: "Menú",
  inicio: "Inicio",
  nosotros: "Nosotros",
  servicios: "Servicios",
  marcas: "Marcas",
  contacto: "Contacto",
  "404": "Página no encontrada",
};

/** Etiqueta legible de un origen. `categoryNames` resuelve `rubro_<slug>`. */
export function whatsappSourceLabel(source: string, categoryNames: Record<string, string> = {}): string {
  const slug = rubroSlugFromSource(source);
  if (slug) return `Solución: ${categoryNames[slug] ?? slug.replace(/-/g, " ")}`;
  return STATIC_SOURCE_LABELS[source as StaticWhatsappSource] ?? source;
}

/**
 * Texto de Nosotros por defecto. Lo usan la web (si no hay nada guardado) y
 * el panel (para precargar el formulario), así los dos muestran lo mismo.
 */
export const DEFAULT_ABOUT_HEADLINE = "Casi 10 años creciendo con la atención como diferencial";
export const DEFAULT_ABOUT_BODY = [
  "Nacimos de la idea de tres socios, Federico, Tomás y Pablo: que comprar materiales eléctricos sea rápido, claro y con alguien del otro lado que sepa lo que vende.",
  "Hoy somos una de las principales casas del rubro en Mendoza, con un salón moderno, depósito propio y un equipo joven que crece con cada recomendación.",
].join("\n\n");

/** Párrafos de un texto del panel: cada salto de línea es un párrafo nuevo. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
