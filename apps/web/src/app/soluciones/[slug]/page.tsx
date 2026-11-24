import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROUTES, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { WhatsappCta } from "@/components/sections/WhatsappCta";
import { BrandsGrid } from "@/components/brands/BrandsGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, rubroSchema } from "@/lib/structured-data";
import { BASE_OPEN_GRAPH } from "@/lib/metadata";
import { getBrandsForRubro, getCategories, getCategory } from "@/lib/cms";
import { rubroWhatsappSource } from "@/lib/whatsapp";

/** Se pre-generan las soluciones activas; las nuevas del panel se generan a pedido. */
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(props: PageProps<"/soluciones/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const rubro = await getCategory(slug);
  if (!rubro) return {};
  const path = ROUTES.rubro(rubro.slug);
  return {
    title: rubro.seoTitle,
    description: rubro.seoDescription,
    alternates: { canonical: path },
    openGraph: { ...BASE_OPEN_GRAPH, title: `${rubro.seoTitle} | ${SITE.name}`, description: rubro.seoDescription, url: path },
  };
}

/**
 * Página de una solución, todo sobre fondo blanco: portada (el banner propio
 * de la solución o, si no tiene, la foto de su card), el texto, las marcas con
 * la franja de WhatsApp al final y el acceso a las otras soluciones.
 */
export default async function RubroPage(props: PageProps<"/soluciones/[slug]">) {
  const { slug } = await props.params;
  const [rubro, categories] = await Promise.all([getCategory(slug), getCategories()]);
  if (!rubro) notFound();

  const brands = await getBrandsForRubro(rubro.slug);
  const cover = rubro.banner
    ? { key: rubro.slug, url: rubro.banner, alt: rubro.imageAlt, position: rubro.bannerPosition }
    : rubro.image
      ? { key: rubro.slug, url: rubro.image, alt: rubro.imageAlt, position: rubro.imagePosition }
      : null;
  const others = categories.filter((item) => item.slug !== rubro.slug);
  const source = rubroWhatsappSource(rubro.slug);
  const name = rubro.name.toLowerCase();

  return (
    <>
      {/* Inicio › Solución: las soluciones no tienen página propia (son una sección del inicio). */}
      <JsonLd schema={breadcrumbSchema([{ name: rubro.name, path: ROUTES.rubro(rubro.slug) }])} />
      <JsonLd schema={rubroSchema(rubro)} />

      {/* Con banner propio: el banner en computadora y la foto vertical de la card en celular. */}
      <PageHero eyebrow="Solución" title={rubro.seoTitle} text={rubro.summary} image={cover} imageMobile={rubro.banner ? rubro.image : undefined} />

      <div className="bg-surface">
        {rubro.description.length > 0 && (
          <section aria-label={`Sobre ${name}`} className="pt-12 sm:pt-20">
            <Container>
              <div className="mx-auto max-w-3xl space-y-5 text-center text-pretty text-base leading-relaxed text-ink sm:text-lg">
                {rubro.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Container>
          </section>
        )}

        <section aria-labelledby={brands.length > 0 ? "marcas-rubro" : `cta-${source}`} className="py-12 sm:py-20">
          <Container>
            {brands.length > 0 && (
              <>
                <SectionHeading
                  id="marcas-rubro"
                  align="center"
                  eyebrow="Marcas"
                  title={`Marcas de ${name} que trabajamos`}
                  text="Entrá al catálogo del fabricante y consultanos por WhatsApp el modelo que necesitás."
                />
                <div className="mt-8 sm:mt-10">
                  <BrandsGrid brands={brands} source={`rubro_${rubro.slug}`} center />
                </div>
              </>
            )}
            <div className={brands.length > 0 ? "mt-10 sm:mt-14" : ""}>
              <WhatsappCta
                bare
                source={source}
                title={`¿Consultas sobre ${name}?`}
                text="Escribinos por WhatsApp con lo que necesitás y te respondemos con stock, precio y plazo de entrega."
              />
            </div>
          </Container>
        </section>

        {others.length > 0 && (
          <nav aria-label="Otras soluciones" className="border-t border-line py-10">
            <Container>
              <p className="text-center font-sub text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Otras soluciones</p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {others.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={ROUTES.rubro(item.slug)}
                      className="pressable inline-flex min-h-11 items-center rounded-full border border-line bg-bg px-4 text-sm font-semibold text-ink hover:border-brand-400"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </nav>
        )}
      </div>
    </>
  );
}
