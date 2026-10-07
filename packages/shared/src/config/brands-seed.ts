/**
 * Marcas iniciales (brief, sección 2). Se cargan una sola vez en la tabla
 * `Brand` con el seed del panel; después el cliente las administra desde ahí.
 * Las URLs de catálogo son los sitios oficiales de cada fabricante.
 * TODO(cliente): confirmar URLs de catálogo y proveer logos.
 */
export type BrandSeed = {
  name: string;
  slug: string;
  catalogUrl: string;
  rubroSlug: string | null;
  order: number;
};

export const BRANDS_SEED: readonly BrandSeed[] = [
  { name: "Schneider Electric", slug: "schneider-electric", catalogUrl: "https://www.se.com/ar/es/", rubroSlug: "materiales-electricos", order: 0 },
  { name: "Kalop", slug: "kalop", catalogUrl: "https://www.kalop.com.ar/", rubroSlug: "materiales-electricos", order: 1 },
  { name: "Genrod", slug: "genrod", catalogUrl: "https://genrod.com.ar/", rubroSlug: "materiales-electricos", order: 2 },
  { name: "Macroled", slug: "macroled", catalogUrl: "https://www.macroled.com.ar/", rubroSlug: "iluminacion", order: 3 },
  { name: "Conextube", slug: "conextube", catalogUrl: "https://www.conextube.com/", rubroSlug: "materiales-electricos", order: 4 },
  { name: "Leuk Iluminación", slug: "leuk", catalogUrl: "https://www.leukiluminacion.com/", rubroSlug: "iluminacion", order: 5 },
  { name: "180° Iluminación", slug: "180-iluminacion", catalogUrl: "https://www.180grados.com.ar/", rubroSlug: "iluminacion", order: 6 },
  { name: "Jadever", slug: "jadever", catalogUrl: "https://www.jadeverherramientas.com/", rubroSlug: "maquinas-y-herramientas", order: 7 },
  { name: "DCK", slug: "dck", catalogUrl: "https://www.dcktool.ar/", rubroSlug: "maquinas-y-herramientas", order: 8 },
  { name: "Cables MH", slug: "cables-mh", catalogUrl: "https://www.industriasmh.com.ar/", rubroSlug: "materiales-electricos", order: 9 },
  { name: "Chint", slug: "chint", catalogUrl: "https://www.chint.com.ar/", rubroSlug: "materiales-electricos", order: 10 },
  { name: "Uniview", slug: "uniview", catalogUrl: "https://www.uniview.ar/", rubroSlug: "camaras-y-videovigilancia", order: 11 },
  { name: "Litex", slug: "litex", catalogUrl: "https://litexled.com.ar/", rubroSlug: "iluminacion", order: 12 },
] as const;
