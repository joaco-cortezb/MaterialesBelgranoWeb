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
