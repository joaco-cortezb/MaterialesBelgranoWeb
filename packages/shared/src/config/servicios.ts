/**
 * Servicios diferenciales (sección 1 del brief). Se muestran como sección
 * del inicio (`/#servicios`). Lo que no está confirmado va con `TODO` visible.
 */
export type Servicio = {
  slug: string;
  title: string;
  /** Una línea para las cards del inicio. */
  short: string;
  /** Respuesta directa y citable (40-60 palabras): JSON-LD y llms.txt. */
  description: string;
  /** Detalle extra o aclaración. Puede llevar `TODO`. */
  detail?: string;
  /** Icono (nombre de react-icons/fa6) resuelto en la web. */
  icon: "truck" | "creditCard" | "box" | "fileInvoice" | "warehouse" | "headset";
};

export const SERVICIOS: readonly Servicio[] = [
  {
    slug: "entrega-24-hs",
    short: "Llevamos el material a tu empresa o a la obra en Mendoza, San Juan y San Luis.",
    title: "Transporte propio con entrega en 24 hs",
    description:
      "Con nuestro transporte propio entregamos pedidos en 24 hs en Mendoza, San Juan y San Luis. Llevamos el material al domicilio de la empresa o directamente a la obra, para que el instalador no pierda tiempo yendo a buscarlo.",
    detail: "TODO(cliente): confirmar zonas exactas con entrega en 24 hs y si tiene costo o mínimo de compra.",
    icon: "truck",
  },
  {
    slug: "envios-a-todo-el-pais",
    short: "Al resto del país, por Andreani. Consultá costo y plazo por WhatsApp.",
    title: "Envíos a todo el país por Andreani",
    description:
      "Enviamos materiales eléctricos e iluminación a todo el país por Andreani. Consultanos por WhatsApp el costo y el plazo de entrega para tu localidad antes de confirmar el pedido.",
    icon: "box",
  },
  {
    slug: "financiacion",
    short: "Múltiples formas de pago y financiación para particulares y empresas.",
    title: "Financiación y medios de pago",
    description:
      "Aceptamos múltiples formas de pago y ofrecemos financiación para que elijas la que mejor se adapta a tu compra, tanto para el consumidor final como para empresas.",
    detail: "TODO(cliente): detallar tarjetas, cuotas, transferencia, efectivo y promociones vigentes.",
    icon: "creditCard",
  },
  {
    slug: "cuenta-corriente",
    short: "Plazos de pago acordados para instaladores y empresas que compran seguido.",
    title: "Cuenta corriente para clientes frecuentes",
    description:
      "Los instaladores y empresas que compran con frecuencia pueden abrir una cuenta corriente con plazos de pago acordados. Es la forma de trabajo de la mitad de nuestros clientes.",
    detail: "TODO(cliente): requisitos para abrir cuenta corriente y plazos habituales.",
    icon: "fileInvoice",
  },
  {
    slug: "stock-amplio",
    short: "Más de 5.000 artículos en tres rangos de precio, listos para despachar.",
    title: "Stock amplio y variedad",
    description:
      "Mantenemos stock permanente de más de 5.000 artículos en tres rangos de precio: económico, intermedio y alta gama. Si algo no está, lo pedimos al fabricante y te avisamos el plazo.",
    icon: "warehouse",
  },
  {
    slug: "atencion-personalizada",
    short: "Mandanos tu listado por WhatsApp y recibí la cotización completa en minutos.",
    title: "Atención personalizada",
    description:
      "Un equipo joven y capacitado te asesora en el salón o por WhatsApp. Mandanos el listado de tu obra y recibís la cotización completa en minutos, sin armar carritos ni buscar producto por producto.",
    icon: "headset",
  },
] as const;
