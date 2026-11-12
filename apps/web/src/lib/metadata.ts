import type { Metadata } from "next";
import { SITE } from "@mb/shared";

/**
 * Base de Open Graph del sitio. Next reemplaza entero el `openGraph` del
 * layout cuando una página define el suyo, así que cada página la suma con
 * spread para no perder la imagen, el tipo ni el locale.
 */
export const BASE_OPEN_GRAPH = {
  type: "website",
  siteName: SITE.name,
  locale: "es_AR",
  images: [{ url: "/og-materiales-belgrano.jpg", width: 1200, height: 630, alt: `${SITE.name} · ${SITE.tagline}` }],
} satisfies NonNullable<Metadata["openGraph"]>;
