import type { MetadataRoute } from "next";
import { ROUTES } from "@mb/shared";
import { getCategories } from "@/lib/cms";
import { siteUrl } from "@/lib/site-url";

/**
 * Sin `lastModified` a propósito: no hay una fecha de cambio real que declarar
 * y Google descarta el lastmod del sitio entero cuando detecta que no refleja
 * cambios.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const categories = await getCategories().catch(() => []);
  return [
    { url: `${base}${ROUTES.home}`, changeFrequency: "weekly", priority: 1 },
    ...categories.map((rubro) => ({
      url: `${base}${ROUTES.rubro(rubro.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${base}${ROUTES.marcas}`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}${ROUTES.nosotros}`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
