/**
 * Slots fijos de imagen que el panel puede reemplazar. La web los lee por
 * `key`; si no hay nada cargado usa el `fallback` (imagen del repo o vacío).
 *
 * `recommended` es la medida sugerida en el panel; el servidor reescala a
 * `maxDimension` de la carpeta (ver `upload-limits` del panel), nunca agranda.
 */
export type ImageSlotGroup = "inicio" | "nosotros";

export type ImageSlotDefinition = {
  key: string;
  group: ImageSlotGroup;
  label: string;
  /** Dónde se ve en la web, para que el cliente sepa qué está cambiando. */
  hint: string;
  recommended: readonly [number, number];
  /** Ruta en `public/` de la web cuando el panel no tiene nada cargado. */
  fallback: string;
  fallbackAlt: string;
};

export const IMAGE_SLOTS: readonly ImageSlotDefinition[] = [
  {
    key: "nosotros.salon",
    group: "nosotros",
    label: "Salón de ventas",
    hint: "Foto del salón en la página Nosotros.",
    recommended: [1600, 1200],
    fallback: "/images/salon-exhibicion-materiales-belgrano.webp",
    fallbackAlt: "Salón de ventas moderno de Materiales Belgrano con pared de luminarias",
  },
  {
    key: "nosotros.deposito",
    group: "nosotros",
    label: "Depósito",
    hint: "Foto del depósito en la página Nosotros.",
    recommended: [1600, 1200],
    fallback: "",
    fallbackAlt: "Depósito de Materiales Belgrano con stock de cables y cañerías",
  },
  {
    key: "nosotros.equipo",
    group: "nosotros",
    label: "Equipo",
    hint: "Foto del equipo en la página Nosotros.",
    recommended: [1600, 1200],
    fallback: "/images/equipo-materiales-belgrano.webp",
    fallbackAlt: "Equipo de Materiales Belgrano",
  },
] as const;

export const IMAGE_SLOT_KEYS = IMAGE_SLOTS.map((slot) => slot.key);

export function findImageSlot(key: string): ImageSlotDefinition | undefined {
  return IMAGE_SLOTS.find((slot) => slot.key === key);
}

export const IMAGE_SLOT_GROUP_LABELS: Record<ImageSlotGroup, string> = {
  inicio: "Inicio",
  nosotros: "Nosotros",
};

/**
 * Portadas: un carrusel de fotos por página, administrado en el panel (tabla
 * `HeroSlide`, columna `page`). El inicio ocupa la primera pantalla; marcas y
 * nosotros usan una versión tipo banner (la mitad de alto). Si una página no
 * tiene fotos activas, la web muestra las de `fallback`.
 */
export const HERO_PAGES = ["inicio", "marcas", "nosotros"] as const;
export type HeroPage = (typeof HERO_PAGES)[number];

export function isHeroPage(value: string): value is HeroPage {
  return (HERO_PAGES as readonly string[]).includes(value);
}

export const HERO_MAX_SLIDES = 8;

export const HERO_PAGE_CONFIG: Record<
  HeroPage,
  { label: string; hint: string; recommended: readonly [number, number]; fallback: readonly { url: string; alt: string }[] }
> = {
  inicio: {
    label: "Inicio",
    hint: "Fotos grandes detrás del título, ocupan toda la primera pantalla.",
    recommended: [2400, 1350],
    fallback: [
      { url: "/images/exhibicion-iluminacion-materiales-belgrano.webp", alt: "Luminarias colgantes encendidas en el salón de Materiales Belgrano" },
      { url: "/images/salon-exhibicion-materiales-belgrano.webp", alt: "Salón de ventas de Materiales Belgrano con exhibición de luminarias" },
    ],
  },
  marcas: {
    label: "Marcas",
    hint: "Banner al inicio de la página Marcas (mitad de alto que el del inicio).",
    recommended: [2400, 900],
    fallback: [{ url: "/images/salon-exhibicion-materiales-belgrano.webp", alt: "Exhibición de productos en el salón de Materiales Belgrano" }],
  },
  nosotros: {
    label: "Nosotros",
    hint: "Banner al inicio de la página Nosotros (mitad de alto que el del inicio).",
    recommended: [2400, 900],
    fallback: [{ url: "/images/salon-materiales-belgrano-mendoza.webp", alt: "Equipo de Materiales Belgrano en el salón de ventas" }],
  },
};

/**
 * Banners del inicio. Cada uno vive en un lugar fijo (`key`); el contenido
 * (título, texto, foto, link) se edita en el panel. Sin fila cargada, la web
 * usa `defaults`.
 */
export const BANNER_KEYS = ["inicio.soluciones", "inicio.final"] as const;
export type BannerKey = (typeof BANNER_KEYS)[number];

export function isBannerKey(value: string): value is BannerKey {
  return (BANNER_KEYS as readonly string[]).includes(value);
}

export const BANNER_CONFIG: Record<
  BannerKey,
  { label: string; hint: string; recommended: readonly [number, number]; defaults: { title: string; text: string; image: string; url: string } }
> = {
  "inicio.soluciones": {
    label: "Banner después de Soluciones",
    hint: "Se muestra en el inicio, debajo del carrusel de soluciones.",
    recommended: [2000, 800],
    defaults: {
      title: "¿Preferís comprar online? Entrá a Distribuidora 370.",
      text: "Una selección de productos con compra directa y envío a todo el país.",
      image: "/images/salon-exhibicion-materiales-belgrano.webp",
      url: "https://www.distribuidora370.ar",
    },
  },
  "inicio.final": {
    label: "Banner final",
    hint: "Se muestra al final del inicio, antes del pie de página.",
    recommended: [2000, 800],
    defaults: {
      title: "¿Tenés una obra o un proyecto? Pasanos el listado.",
      text: "Te cotizamos completo en minutos por WhatsApp.",
      image: "",
      url: "/go/whatsapp/inicio",
    },
  },
};
