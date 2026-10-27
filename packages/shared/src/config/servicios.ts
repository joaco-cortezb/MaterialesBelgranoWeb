/**
 * Servicios diferenciales (sección 1 del brief). Se muestran como sección
 * del inicio (`/#servicios`). Lo que no está confirmado va con `TODO` visible.
 */
export type Servicio = {
  slug: string;
  title: string;
  /** Dato grande de la sección del inicio ("24 hs", "Todo el país"). */
  stat: string;
  /** Título corto (una línea) bajo el dato. */
  label: string;
  /** Una línea para el inicio; todas de largo parecido para que queden parejas. */
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
    stat: "24 hs",
    label: "Transporte propio",
    short: "Entrega en 24 hs en Mendoza, San Juan y San Luis.",
    title: "Transporte propio con entrega en 24 hs",
    description:
      "Con nuestro transporte propio entregamos en 24 hs en Mendoza, San Juan y San Luis. Consultanos por WhatsApp para coordinar la entrega de tu pedido.",
    detail: "TODO(cliente): confirmar zonas exactas con entrega en 24 hs y si tiene costo o mínimo de compra.",
    icon: "truck",
  },
  {
    slug: "envios-a-todo-el-pais",
    stat: "Todo el país",
    label: "Envíos por Andreani",
    short: "Al resto del país, enviamos tu pedido por Andreani.",
    title: "Envíos a todo el país por Andreani",
    description:
      "Enviamos a todo el país por Andreani. Consultanos por WhatsApp el costo y el plazo de entrega para tu localidad.",
    icon: "box",
  },
  {
    slug: "financiacion",
    stat: "Financiación",
    label: "Medios de pago",
    short: "Financiación y distintos medios de pago para tu compra.",
    title: "Financiación y medios de pago",
    description:
      "Ofrecemos financiación y distintos medios de pago. Consultanos por WhatsApp las opciones vigentes para tu compra.",
    detail: "TODO(cliente): detallar tarjetas, cuotas, transferencia, efectivo y promociones vigentes.",
    icon: "creditCard",
  },
  {
    slug: "cuenta-corriente",
    stat: "Cuenta corriente",
    label: "Para clientes frecuentes",
    short: "Una cuenta corriente para los clientes que compran seguido.",
    title: "Cuenta corriente para clientes frecuentes",
    description:
      "Los clientes frecuentes pueden trabajar con cuenta corriente. Consultanos por WhatsApp cómo abrir la tuya.",
    detail: "TODO(cliente): requisitos para abrir cuenta corriente y plazos habituales.",
    icon: "fileInvoice",
  },
  {
    slug: "stock-amplio",
    stat: "Stock amplio",
    label: "En todos los rubros",
    short: "Eléctricos, iluminación, herramientas, smart y cámaras.",
    title: "Stock amplio y variedad",
    description:
      "Tenemos stock amplio en materiales eléctricos, iluminación, máquinas y herramientas, dispositivos smart, y cámaras y videovigilancia.",
    icon: "warehouse",
  },
  {
    slug: "atencion-personalizada",
    stat: "Atención",
    label: "Personalizada",
    short: "Te asesoramos en el salón o por WhatsApp, como prefieras.",
    title: "Atención personalizada",
    description:
      "Te atendemos de forma personalizada, en el salón o por WhatsApp, para ayudarte a elegir lo que necesitás.",
    icon: "headset",
  },
] as const;
