import type { Metadata } from "next";
import { ROUTES, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { BrandsExplorer } from "@/components/brands/BrandsExplorer";
import { PageBanner } from "@/components/sections/PageBanner";
import { WhatsappCta } from "@/components/sections/WhatsappCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getBrands, getCategories, getHeroSlides } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Marcas",
  description:
    "Marcas de materiales eléctricos e iluminación que trabaja Materiales Belgrano en Mendoza: Schneider Electric, Kalop, Genrod, Macroled, Leuk, Chint, Uniview y más. Catálogos oficiales.",
  alternates: { canonical: ROUTES.marcas },
  openGraph: { title: `Marcas | ${SITE.name}`, url: ROUTES.marcas },
};

export default async function MarcasPage() {
  const [brands, categories, slides] = await Promise.all([getBrands(), getCategories(), getHeroSlides("marcas")]);
  const groups = categories
    .map((rubro) => ({ slug: rubro.slug, name: rubro.name, brands: brands.filter((brand) => brand.rubroSlug === rubro.slug) }))
    .filter((group) => group.brands.length > 0);
  const ungrouped = brands.filter((brand) => !brand.rubroSlug || !categories.some((rubro) => rubro.slug === brand.rubroSlug));
  if (ungrouped.length > 0) groups.push({ slug: "otras", name: "Otras marcas", brands: ungrouped });

  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: "Marcas", path: ROUTES.marcas }])} />
      <PageBanner
        slides={slides}
        eyebrow="Marcas"
        title="Los fabricantes que trabajamos"
        text="Mirá el catálogo oficial de cada marca y pedinos el producto por WhatsApp."
      />
      <section className="py-14 sm:py-20">
        <Container>
          <BrandsExplorer groups={groups} />
        </Container>
      </section>
      <WhatsappCta source="marcas" title="¿Encontraste el producto en el catálogo?" text="Mandanos el código o una captura por WhatsApp y te confirmamos stock y precio." />
    </>
  );
}
