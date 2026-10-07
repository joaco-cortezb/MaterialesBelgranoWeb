/**
 * Slots fijos de imagen que el panel puede reemplazar. La web los lee por
 * `key`; si no hay nada cargado usa el `fallback` (imagen del repo o vacío).
 *
 * `recommended` es la medida sugerida en el panel; el servidor reescala a
 * `maxDimension` de la carpeta (ver `upload-limits` del panel), nunca agranda.
 */
export type ImageSlotGroup = "inicio" | "nosotros" | "rubros";

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
    key: "home.hero",
    group: "inicio",
    label: "Portada del inicio",
    hint: "Imagen grande detrás del título de la página de inicio.",
    recommended: [2400, 1350],
    fallback: "/images/exhibicion-iluminacion-materiales-belgrano.webp",
    fallbackAlt: "Luminarias colgantes encendidas en el salón de Materiales Belgrano, Mendoza",
  },
  {
    key: "home.rubros",
    group: "inicio",
    label: "Imagen de la sección de soluciones",
    hint: "Foto al costado del listado de soluciones en el inicio.",
    recommended: [1600, 1200],
    fallback: "/images/exhibicion-iluminacion-materiales-belgrano.webp",
    fallbackAlt: "Exhibición de luminarias encendidas en el salón de Materiales Belgrano",
  },
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
  {
    key: "rubros.materiales-electricos.hero",
    group: "rubros",
    label: "Solución: materiales eléctricos",
    hint: "Imagen principal de la página de la solución.",
    recommended: [2000, 1250],
    fallback: "",
    fallbackAlt: "Instalación eléctrica con tablero y cables",
  },
  {
    key: "rubros.iluminacion.hero",
    group: "rubros",
    label: "Solución: iluminación",
    hint: "Imagen principal de la página de la solución.",
    recommended: [2000, 1250],
    fallback: "/images/exhibicion-iluminacion-materiales-belgrano.webp",
    fallbackAlt: "Luminarias encendidas en la exhibición de Materiales Belgrano",
  },
  {
    key: "rubros.maquinas-y-herramientas.hero",
    group: "rubros",
    label: "Solución: máquinas y herramientas",
    hint: "Imagen principal de la página de la solución.",
    recommended: [2000, 1250],
    fallback: "",
    fallbackAlt: "Herramientas eléctricas y a batería",
  },
  {
    key: "rubros.dispositivos-smart.hero",
    group: "rubros",
    label: "Solución: dispositivos smart",
    hint: "Imagen principal de la página de la solución.",
    recommended: [2000, 1250],
    fallback: "",
    fallbackAlt: "Dispositivos inteligentes instalados en un ambiente",
  },
  {
    key: "rubros.camaras-y-videovigilancia.hero",
    group: "rubros",
    label: "Solución: cámaras y videovigilancia",
    hint: "Imagen principal de la página de la solución.",
    recommended: [2000, 1250],
    fallback: "",
    fallbackAlt: "Cámara de seguridad instalada en una fachada",
  },
] as const;

export const IMAGE_SLOT_KEYS = IMAGE_SLOTS.map((slot) => slot.key);

export function findImageSlot(key: string): ImageSlotDefinition | undefined {
  return IMAGE_SLOTS.find((slot) => slot.key === key);
}

export const IMAGE_SLOT_GROUP_LABELS: Record<ImageSlotGroup, string> = {
  inicio: "Inicio",
  nosotros: "Nosotros",
  rubros: "Soluciones",
};
