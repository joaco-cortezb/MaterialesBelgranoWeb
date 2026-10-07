/**
 * Datos del negocio. Única fuente de verdad para la web, el panel, el JSON-LD y
 * el `llms.txt`. Todo lo marcado con `TODO` lo tiene que confirmar el cliente:
 * salió de la web anterior o del brief y no está verificado.
 */
export const SITE = {
  name: "Materiales Belgrano",
  shortName: "MB",
  /** TODO(cliente): confirmar razón social (sale del footer de la web anterior). */
  legalName: "Materiales FTP S.A.",
  tagline: "Electricidad + Iluminación",
  description:
    "Casa de materiales eléctricos e iluminación en Mendoza. Stock amplio, atención personalizada, financiación y entrega en 24 hs en Mendoza, San Juan y San Luis. Envíos a todo el país.",
  /** TODO(cliente): año exacto de fundación ("casi 10 años" según el brief). */
  foundedYear: 2017,
  address: {
    street: "Dorrego 375",
    locality: "Godoy Cruz",
    region: "Mendoza",
    /** TODO(cliente): confirmar código postal. */
    postalCode: "M5501",
    country: "AR",
    singleLine: "Dorrego 375, Godoy Cruz, Mendoza",
  },
  /** TODO(cliente): coordenadas exactas del local para el mapa y el JSON-LD. */
  geo: { latitude: -32.9245, longitude: -68.8458 },
  phone: { display: "0261 422-2066", e164: "+542614222066" },
  email: "ventas@materialesbelgrano.com",
  /**
   * Número de respaldo cuando el panel todavía no tiene ninguno cargado.
   * TODO(cliente): confirmar.
   */
  whatsappFallback: { phone: "5492615330777", label: "Ventas" },
  hours: [
    { days: "Lunes a viernes", opens: "08:30", closes: "18:00" },
    { days: "Sábados", opens: "09:00", closes: "13:00" },
  ],
  /** Para `openingHoursSpecification` (días en inglés como pide schema.org). */
  openingHours: [
    { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "18:00" },
    { dayOfWeek: ["Saturday"], opens: "09:00", closes: "13:00" },
  ],
  social: {
    instagram: "https://www.instagram.com/materialesbelgrano",
    facebook: "https://www.facebook.com/MatBelgrano",
    youtube: "https://www.youtube.com/@MaterialesBelgrano",
  },
  /** Tienda online del grupo. */
  distribuidora370: {
    name: "Distribuidora 370",
    url: "https://www.distribuidora370.ar",
  },
  /** Zonas con transporte propio y entrega en 24 hs. */
  deliveryRegions: ["Mendoza", "San Juan", "San Luis"] as const,
  /** Transporte para el resto del país. */
  nationalCarrier: "Andreani",
  /** Público al que le vendemos; se usa en copy y en el schema. */
  audiences: ["instaladores electricistas", "empresas y constructoras", "consumidor final"] as const,
} as const;

export type Audience = (typeof SITE.audiences)[number];

/** Nombres de ruta de la web. Centralizados para que el menú, el sitemap y los links no diverjan. */
export const ROUTES = {
  home: "/",
  nosotros: "/nosotros",
  servicios: "/servicios",
  rubros: "/rubros",
  rubro: (slug: string) => `/rubros/${slug}`,
  marcas: "/marcas",
  contacto: "/contacto",
} as const;

export const NAV_LINKS = [
  { href: ROUTES.home, label: "Inicio" },
  { href: ROUTES.rubros, label: "Rubros" },
  { href: ROUTES.servicios, label: "Servicios" },
  { href: ROUTES.marcas, label: "Marcas" },
  { href: ROUTES.nosotros, label: "Nosotros" },
  { href: ROUTES.contacto, label: "Contacto" },
] as const;
