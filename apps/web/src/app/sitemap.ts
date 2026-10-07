import type { MetadataRoute } from "next";
import { ROUTES, RUBROS } from "@mb/shared";
import { siteUrl } from "@/lib/site-url";

/**
 * Sin `lastModified` a propósito: no hay una fecha de cambio real que declarar
 * y Google descarta el lastmod del sitio entero cuando detecta que no refleja
 * cambios.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}${ROUTES.home}`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}${ROUTES.rubros}`, changeFrequency: "monthly", priority: 0.9 },
    ...RUBROS.map((rubro) => ({
      url: `${base}${ROUTES.rubro(rubro.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${base}${ROUTES.marcas}`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}${ROUTES.nosotros}`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
