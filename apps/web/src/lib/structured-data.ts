import { ROUTES, SITE, type Faq, type Rubro, type Servicio } from "@mb/shared";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

/**
 * JSON-LD del sitio. Es lo que Google usa para el panel del negocio y lo que
 * los motores de IA leen para citar datos (zona de entrega, horarios,
 * rubros). Todo sale de `@mb/shared`: nada se escribe dos veces.
 */
const STORE_ID = `${siteUrl()}/#store`;

export function storeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    "@id": STORE_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: siteUrl(),
    logo: absoluteUrl("/brand/logo-materiales-belgrano-h.png"),
    image: absoluteUrl("/og-materiales-belgrano.jpg"),
    telephone: SITE.phone.e164,
    email: SITE.email,
    foundingDate: String(SITE.foundedYear),
    priceRange: "$$",
    currenciesAccepted: "ARS",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    openingHoursSpecification: SITE.openingHours.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: spec.dayOfWeek,
      opens: spec.opens,
      closes: spec.closes,
    })),
    areaServed: SITE.deliveryRegions.map((region) => ({
      "@type": "State",
      name: region,
      containedInPlace: { "@type": "Country", name: "Argentina" },
    })),
    sameAs: Object.values(SITE.social),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: SITE.phone.e164,
        email: SITE.email,
        availableLanguage: "es",
        areaServed: "AR",
      },
    ],
    knowsAbout: ["Materiales eléctricos", "Iluminación LED", "Herramientas eléctricas", "Domótica", "Videovigilancia"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl(),
    name: SITE.name,
    inLanguage: "es-AR",
    publisher: { "@id": STORE_ID },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Inicio", path: ROUTES.home }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: readonly Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Un rubro es una categoría de oferta del negocio. */
export function rubroSchema(rubro: Rubro) {
  const url = absoluteUrl(ROUTES.rubro(rubro.slug));
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: rubro.seoTitle,
    description: rubro.seoDescription,
    inLanguage: "es-AR",
    isPartOf: { "@id": `${siteUrl()}/#website` },
    about: {
      "@type": "OfferCatalog",
      name: rubro.name,
      itemListElement: rubro.subcategories.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Product", name },
      })),
    },
    provider: { "@id": STORE_ID },
  };
}

export function servicesSchema(servicios: readonly Servicio[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicios de Materiales Belgrano",
    itemListElement: servicios.map((servicio, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: servicio.title,
        description: servicio.description,
        provider: { "@id": STORE_ID },
        areaServed: SITE.deliveryRegions.map((region) => ({ "@type": "State", name: region })),
      },
    })),
  };
}

/** Escapa `<` para que un texto con `</script>` no corte el bloque. */
export function jsonLdScript(schema: object): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
