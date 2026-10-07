/**
 * Slots fijos de imagen que el panel puede reemplazar. La web los lee por
 * `key`; si no hay nada cargado usa el `fallback` (imagen del repo o vacío).
 *
 * `recommended` es la medida sugerida en el panel; el servidor reescala a
 * `maxDimension` de la carpeta (ver `upload-limits` del panel), nunca agranda.
 */
export type ImageSlotGroup = "inicio" | "nosotros" | "servicios" | "rubros";

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
    label: "Imagen de la sección de rubros",
    hint: "Foto al costado del listado de rubros en el inicio.",
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
    key: "servicios.hero",
    group: "servicios",
    label: "Portada de Servicios",
    hint: "Imagen grande al inicio de la página Servicios.",
    recommended: [2400, 1200],
    fallback: "",
    fallbackAlt: "Depósito de Materiales Belgrano listo para despachar pedidos",
  },
  {
    key: "servicios.entrega",
    group: "servicios",
    label: "Banner: entrega en 24 hs",
    hint: "Foto del banner de transporte propio.",
    recommended: [1600, 1000],
    fallback: "",
    fallbackAlt: "Camión de reparto de Materiales Belgrano",
  },
  {
    key: "servicios.envios",
    group: "servicios",
    label: "Banner: envíos a todo el país",
    hint: "Foto del banner de envíos por Andreani.",
    recommended: [1600, 1000],
    fallback: "",
    fallbackAlt: "Pedido embalado para envío",
  },
  {
    key: "servicios.financiacion",
    group: "servicios",
    label: "Banner: financiación",
    hint: "Foto del banner de financiación y medios de pago.",
    recommended: [1600, 1000],
    fallback: "",
    fallbackAlt: "Caja y medios de pago en Materiales Belgrano",
  },
  {
    key: "servicios.cuenta-corriente",
    group: "servicios",
    label: "Banner: cuenta corriente",
    hint: "Foto del banner de cuenta corriente.",
    recommended: [1600, 1000],
    fallback: "",
    fallbackAlt: "Atención a empresas en Materiales Belgrano",
  },
  {
    key: "servicios.stock",
    group: "servicios",
    label: "Banner: stock amplio",
    hint: "Foto del banner de stock.",
    recommended: [1600, 1000],
    fallback: "",
    fallbackAlt: "Estanterías con stock en el depósito de Materiales Belgrano",
  },
  {
    key: "servicios.atencion",
    group: "servicios",
    label: "Banner: atención personalizada",
    hint: "Foto del banner de atención.",
    recommended: [1600, 1000],
    fallback: "/images/equipo-materiales-belgrano.webp",
    fallbackAlt: "Vendedor de Materiales Belgrano asesorando a un cliente",
  },
  {
    key: "rubros.materiales-electricos.hero",
    group: "rubros",
    label: "Rubro: materiales eléctricos",
    hint: "Imagen principal de la página del rubro.",
    recommended: [2000, 1250],
    fallback: "",
    fallbackAlt: "Instalación eléctrica con tablero y cables",
  },
  {
    key: "rubros.iluminacion.hero",
    group: "rubros",
    label: "Rubro: iluminación",
    hint: "Imagen principal de la página del rubro.",
    recommended: [2000, 1250],
    fallback: "/images/exhibicion-iluminacion-materiales-belgrano.webp",
    fallbackAlt: "Luminarias encendidas en la exhibición de Materiales Belgrano",
  },
  {
    key: "rubros.maquinas-y-herramientas.hero",
    group: "rubros",
    label: "Rubro: máquinas y herramientas",
    hint: "Imagen principal de la página del rubro.",
    recommended: [2000, 1250],
    fallback: "",
    fallbackAlt: "Herramientas eléctricas y a batería",
  },
  {
    key: "rubros.dispositivos-smart.hero",
    group: "rubros",
    label: "Rubro: dispositivos smart",
    hint: "Imagen principal de la página del rubro.",
    recommended: [2000, 1250],
    fallback: "",
    fallbackAlt: "Dispositivos inteligentes instalados en un ambiente",
  },
  {
    key: "rubros.camaras-y-videovigilancia.hero",
    group: "rubros",
    label: "Rubro: cámaras y videovigilancia",
    hint: "Imagen principal de la página del rubro.",
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
  servicios: "Servicios",
  rubros: "Rubros",
};
