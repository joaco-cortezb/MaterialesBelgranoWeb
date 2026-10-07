import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/**
 * Los bots de IA (GPTBot, PerplexityBot, ClaudeBot, Google-Extended) quedan
 * habilitados a propósito: bloquearlos no evita que el negocio aparezca en
 * esas respuestas, evita que lo citen con la información correcta.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/go/"] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
