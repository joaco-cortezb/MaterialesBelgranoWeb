/**
 * Servicios diferenciales (sección 1 del brief). Son los banners de /servicios
 * y el resumen del inicio. Lo que no está confirmado va con `TODO` visible.
 */
export type Servicio = {
  slug: string;
  title: string;
  /** Respuesta directa y citable (40-60 palabras). */
  description: string;
  /** Detalle extra o aclaración. Puede llevar `TODO`. */
  detail?: string;
  /** Icono (nombre de react-icons/fa6) resuelto en la web. */
  icon: "truck" | "creditCard" | "box" | "fileInvoice" | "warehouse" | "headset";
  imageSlot: string;
};

export const SERVICIOS: readonly Servicio[] = [
  {
    slug: "entrega-24-hs",
    title: "Transporte propio con entrega en 24 hs",
    description:
      "Con nuestro transporte propio entregamos pedidos en 24 hs en Mendoza, San Juan y San Luis. Llevamos el material al domicilio de la empresa o directamente a la obra, para que el instalador no pierda tiempo yendo a buscarlo.",
    detail: "TODO(cliente): confirmar zonas exactas con entrega en 24 hs y si tiene costo o mínimo de compra.",
    icon: "truck",
    imageSlot: "servicios.entrega",
  },
  {
    slug: "envios-a-todo-el-pais",
    title: "Envíos a todo el país por Andreani",
    description:
      "Enviamos materiales eléctricos e iluminación a todo el país por Andreani. Consultanos por WhatsApp el costo y el plazo de entrega para tu localidad antes de confirmar el pedido.",
    icon: "box",
    imageSlot: "servicios.envios",
  },
  {
    slug: "financiacion",
    title: "Financiación y medios de pago",
    description:
      "Aceptamos múltiples formas de pago y ofrecemos financiación para que elijas la que mejor se adapta a tu compra, tanto para el consumidor final como para empresas.",
    detail: "TODO(cliente): detallar tarjetas, cuotas, transferencia, efectivo y promociones vigentes.",
    icon: "creditCard",
    imageSlot: "servicios.financiacion",
  },
  {
    slug: "cuenta-corriente",
    title: "Cuenta corriente para clientes frecuentes",
    description:
      "Los instaladores y empresas que compran con frecuencia pueden abrir una cuenta corriente con plazos de pago acordados. Es la forma de trabajo de la mitad de nuestros clientes.",
    detail: "TODO(cliente): requisitos para abrir cuenta corriente y plazos habituales.",
    icon: "fileInvoice",
    imageSlot: "servicios.cuenta-corriente",
  },
  {
    slug: "stock-amplio",
    title: "Stock amplio y variedad",
    description:
      "Mantenemos stock permanente de más de 5.000 artículos en tres rangos de precio: económico, intermedio y alta gama. Si algo no está, lo pedimos al fabricante y te avisamos el plazo.",
    icon: "warehouse",
    imageSlot: "servicios.stock",
  },
  {
    slug: "atencion-personalizada",
    title: "Atención personalizada",
    description:
      "Un equipo joven y capacitado te asesora en el salón o por WhatsApp. Mandanos el listado de tu obra y recibís la cotización completa en minutos, sin armar carritos ni buscar producto por producto.",
    icon: "headset",
    imageSlot: "servicios.atencion",
  },
] as const;
