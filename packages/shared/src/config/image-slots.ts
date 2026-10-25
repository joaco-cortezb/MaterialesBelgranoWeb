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
    key: "home.distribuidora",
    group: "inicio",
    label: "Banner Distribuidora 370",
    hint: "Fondo del banner que lleva a la tienda online del grupo.",
    recommended: [2000, 900],
    fallback: "/images/salon-exhibicion-materiales-belgrano.webp",
    fallbackAlt: "Salón de ventas de Materiales Belgrano con exhibición de luminarias",
  },
  {
    key: "nosotros.hero",
    group: "nosotros",
    label: "Portada de Nosotros",
    hint: "Imagen grande al inicio de la página Nosotros.",
    recommended: [2400, 1200],
    fallback: "/images/salon-materiales-belgrano-mendoza.webp",
    fallbackAlt: "Equipo de Materiales Belgrano en el salón de ventas de Godoy Cruz, Mendoza",
  },
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
 * Portada del inicio: un carrusel de fotos que se administra en el panel
 * (tabla `HeroSlide`). Si no hay ninguna activa, la web muestra estas.
 */
export const HERO_RECOMMENDED: readonly [number, number] = [2400, 1350];
export const HERO_MAX_SLIDES = 8;

export const HERO_FALLBACK_SLIDES = [
  {
    url: "/images/exhibicion-iluminacion-materiales-belgrano.webp",
    alt: "Luminarias colgantes encendidas en el salón de Materiales Belgrano, Mendoza",
  },
  {
    url: "/images/salon-exhibicion-materiales-belgrano.webp",
    alt: "Salón de ventas de Materiales Belgrano con exhibición de luminarias",
  },
] as const;
