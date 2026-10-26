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
    hint: "Fotos grandes detrás del título: ocupan toda la primera pantalla. Usá fotos horizontales con lo importante al centro (en celular se ve sólo la parte central).",
    recommended: [2560, 1440],
    fallback: [{ url: "/images/salon-materiales-belgrano-mendoza.webp", alt: "Salón de ventas de Materiales Belgrano en Godoy Cruz, Mendoza" }],
  },
  marcas: {
    label: "Marcas",
    hint: "Banner al inicio de la página Marcas (la mitad de alto que el del inicio). Foto horizontal con lo importante al centro.",
    recommended: [2560, 800],
    fallback: [{ url: "/images/salon-exhibicion-materiales-belgrano.webp", alt: "Exhibición de productos en el salón de Materiales Belgrano" }],
  },
  nosotros: {
    label: "Nosotros",
    hint: "Banner al inicio de la página Nosotros (la mitad de alto que el del inicio). Foto horizontal con lo importante al centro.",
    recommended: [2560, 800],
    fallback: [{ url: "/images/salon-materiales-belgrano-mendoza.webp", alt: "Equipo de Materiales Belgrano en el salón de ventas" }],
  },
};

/**
 * Banners del inicio: sólo imagen (el diseño, con su texto, va en la foto),
 * una apaisada para computadora y otra para celular, todos del mismo tamaño. Si tienen link, todo el banner es clickeable. Se
 * editan en el panel; sin fila cargada, la web usa `defaults`.
 */
export const BANNER_KEYS = ["inicio.soluciones", "inicio.final"] as const;
export type BannerKey = (typeof BANNER_KEYS)[number];

export function isBannerKey(value: string): value is BannerKey {
  return (BANNER_KEYS as readonly string[]).includes(value);
}

/** Medidas únicas de los banners (la web los muestra con estas proporciones). */
export const BANNER_SIZE: readonly [number, number] = [2400, 600];
export const BANNER_MOBILE_SIZE: readonly [number, number] = [1200, 900];

export const BANNER_CONFIG: Record<
  BannerKey,
  { label: string; hint: string; defaults: { title: string; text: string; image: string; imageMobile: string; url: string } }
> = {
  "inicio.soluciones": {
    label: "Banner después de Soluciones",
    hint: "Se muestra en el inicio, debajo del carrusel de soluciones.",
    defaults: {
      title: "Comprá online en Distribuidora 370, la tienda online del grupo, con envíos a todo el país",
      text: "",
      image: "/images/banners/tienda-online.webp",
      imageMobile: "/images/banners/tienda-online-mobile.webp",
      url: "https://www.distribuidora370.ar",
    },
  },
  "inicio.final": {
    label: "Banner final",
    hint: "Se muestra al final del inicio, antes del pie de página.",
    defaults: {
      title: "¿Tenés una obra? Pasanos el listado y te cotizamos todo junto por WhatsApp",
      text: "",
      image: "/images/banners/cotizacion-whatsapp.webp",
      imageMobile: "/images/banners/cotizacion-whatsapp-mobile.webp",
      url: "/go/whatsapp/inicio",
    },
  },
};
