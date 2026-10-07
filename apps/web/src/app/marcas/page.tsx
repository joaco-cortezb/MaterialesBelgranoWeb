import type { Metadata } from "next";
import { ROUTES, RUBROS, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrandsGrid } from "@/components/brands/BrandsGrid";
import { WhatsappCta } from "@/components/sections/WhatsappCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getBrands } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Marcas",
  description:
    "Marcas de materiales eléctricos e iluminación que trabaja Materiales Belgrano en Mendoza: Schneider Electric, Kalop, Genrod, Macroled, Leuk, Chint, Uniview y más. Catálogos oficiales.",
  alternates: { canonical: ROUTES.marcas },
  openGraph: { title: `Marcas | ${SITE.name}`, url: ROUTES.marcas },
};

export default async function MarcasPage() {
  const brands = await getBrands();
  const grouped = RUBROS.map((rubro) => ({ rubro, brands: brands.filter((brand) => brand.rubroSlug === rubro.slug) })).filter(
    (group) => group.brands.length > 0,
  );
  const ungrouped = brands.filter((brand) => !brand.rubroSlug || !RUBROS.some((rubro) => rubro.slug === brand.rubroSlug));

  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: "Marcas", path: ROUTES.marcas }])} />
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Marcas"
            title="Los fabricantes que trabajamos, con su catálogo oficial"
            text="No tenemos catálogo propio a propósito: con más de 5.000 artículos sería lento e incompleto. Mirá el catálogo del fabricante y pedinos el producto por WhatsApp; te cotizamos en minutos."
          />

          {grouped.length === 0 && ungrouped.length === 0 ? (
            <div className="mt-12">
              <BrandsGrid brands={[]} source="marcas" />
            </div>
          ) : (
            <div className="mt-12 space-y-14">
              {grouped.map(({ rubro, brands: rubroBrands }) => (
                <section key={rubro.slug} aria-labelledby={`marcas-${rubro.slug}`}>
                  <h2 id={`marcas-${rubro.slug}`} className="text-xl font-bold tracking-tight text-ink-dark">
                    {rubro.name}
                  </h2>
                  <div className="mt-5">
                    <BrandsGrid brands={rubroBrands} source="marcas" />
                  </div>
                </section>
              ))}
              {ungrouped.length > 0 && (
                <section aria-labelledby="marcas-otras">
                  <h2 id="marcas-otras" className="text-xl font-bold tracking-tight text-ink-dark">
                    Otras marcas
                  </h2>
                  <div className="mt-5">
                    <BrandsGrid brands={ungrouped} source="marcas" />
                  </div>
                </section>
              )}
            </div>
          )}
        </Container>
      </section>
      <WhatsappCta source="marcas" title="¿Encontraste el producto en el catálogo?" text="Mandanos el código o una captura por WhatsApp y te confirmamos stock y precio." />
    </>
  );
}
