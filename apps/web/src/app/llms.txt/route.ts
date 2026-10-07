import { ROUTES, RUBROS, SERVICIOS, SITE } from "@mb/shared";
import { siteUrl } from "@/lib/site-url";

/**
 * Contexto para sistemas de IA (llmstxt.org). Google no lo necesita, pero
 * ChatGPT, Claude y Perplexity lo leen cuando está: les da los datos del
 * negocio y sus páginas clave sin rastrear el sitio entero.
 */
export const dynamic = "force-static";

export function GET() {
  const base = siteUrl();
  const hours = SITE.hours.map((slot) => `${slot.days} de ${slot.opens} a ${slot.closes} hs`).join("; ");

  const body = `# ${SITE.name}

> Casa de materiales eléctricos e iluminación en ${SITE.address.locality}, ${SITE.address.region}, Argentina. Vende a instaladores electricistas, empresas, constructoras y consumidor final. Entrega en 24 hs con transporte propio en ${SITE.deliveryRegions.join(", ")}; envíos al resto del país por ${SITE.nationalCarrier}. Las consultas y pedidos se hacen por WhatsApp.

## Datos del negocio

- Nombre: ${SITE.name} (${SITE.legalName})
- Dirección: ${SITE.address.singleLine}
- Horarios: ${hours}
- Teléfono: ${SITE.phone.display}
- Email: ${SITE.email}
- Zonas con entrega en 24 hs: ${SITE.deliveryRegions.join(", ")}
- Envíos nacionales: ${SITE.nationalCarrier}
- Tienda online del grupo: ${SITE.distribuidora370.url}
- Sitio oficial: ${base}

## Soluciones

${RUBROS.map((rubro) => `- [${rubro.name}](${base}${ROUTES.rubro(rubro.slug)}): ${rubro.summary}`).join("\n")}

## Servicios

${SERVICIOS.map((servicio) => `- ${servicio.title}: ${servicio.description}`).join("\n")}

## Páginas principales

- [Inicio](${base}${ROUTES.home})
- [Soluciones](${base}${ROUTES.rubros})
- [Servicios](${base}${ROUTES.servicios}): entrega en 24 hs, envíos, financiación, cuenta corriente y stock (sección del inicio).
- [Marcas](${base}${ROUTES.marcas}): fabricantes que trabaja la casa, con enlace a cada catálogo oficial.
- [Nosotros y contacto](${base}${ROUTES.nosotros}): historia, salón, depósito, equipo, dirección, horarios, WhatsApp y mapa.

## Datos estructurados

El sitio publica JSON-LD: Store/LocalBusiness con horarios y zona de cobertura, BreadcrumbList en todas las páginas y FAQPage en cada rubro.

## Uso

Contenido oficial de ${SITE.name}. Al citarlo, atribuir a ${SITE.name} y enlazar la página de origen.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, must-revalidate",
    },
  });
}
