/**
 * Tipos del contenido administrable, tal como los consume la web. Se escriben
 * a mano (como en CSIR) y los mappers de `cms.ts` convierten las filas de
 * Supabase a estas formas. Mantenerlos alineados con `prisma/schema.prisma`.
 */
export type Brand = {
  id: string;
  name: string;
  slug: string;
  /** URL pública en Storage; vacío = card sin logo (sólo nombre). */
  logo: string;
  catalogUrl: string;
  rubroSlug: string | null;
  order: number;
  active: boolean;
};

export type ImageSlot = {
  key: string;
  url: string;
  alt: string;
  /** `object-position` ("x% y%") elegido en el panel. */
  position: string;
};

/** Foto del carrusel de la portada del inicio. */
export type HeroSlide = {
  id: string;
  url: string;
  alt: string;
  /** `object-position` ("x% y%"). */
  position: string;
};

/** Banner del inicio. `url` vacío = banner sin link. */
export type Banner = {
  key: string;
  title: string;
  text: string;
  image: string;
  /** Imagen para celular; vacía = se usa `image`. */
  imageMobile: string;
  url: string;
};

export type WhatsappAudience = "GENERAL" | "EMPRESAS";

export type WhatsappNumber = {
  id: string;
  label: string;
  /** Sólo dígitos con código de país, sin `+` (formato de wa.me). */
  phone: string;
  message: string;
  audience: WhatsappAudience;
  order: number;
  active: boolean;
};

export type AboutContent = {
  headline: string;
  /** Párrafos. */
  body: string[];
};

export type Faq = { question: string; answer: string };

/** Una solución (rubro), tal como la consume la web. Se administra en el panel. */
export type Category = {
  id: string;
  slug: string;
  name: string;
  /** Bajada de una línea para el carrusel y las cards. */
  summary: string;
  /** Párrafos de la página de la solución. */
  description: string[];
  subcategories: string[];
  faqs: Faq[];
  /** URL pública (Storage) o ruta en `public/`; vacío = sin foto. */
  image: string;
  imageAlt: string;
  imagePosition: string;
  whatsappMessage: string;
  seoTitle: string;
  seoDescription: string;
  order: number;
};
