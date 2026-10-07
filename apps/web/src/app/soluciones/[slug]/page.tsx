import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import { findRubro, ROUTES, RUBRO_SLUGS, RUBROS, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { WhatsappCta } from "@/components/sections/WhatsappCta";
import { BrandsGrid } from "@/components/brands/BrandsGrid";
import { FaqList } from "@/components/rubros/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, rubroSchema } from "@/lib/structured-data";
import { getBrandsForRubro, getImageSlot } from "@/lib/cms";
import { rubroWhatsappSource } from "@/lib/whatsapp";

export function generateStaticParams() {
  return RUBRO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/soluciones/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const rubro = findRubro(slug);
  if (!rubro) return {};
  const path = ROUTES.rubro(rubro.slug);
  return {
    title: rubro.seoTitle,
    description: rubro.seoDescription,
    alternates: { canonical: path },
    openGraph: { title: `${rubro.seoTitle} | ${SITE.name}`, description: rubro.seoDescription, url: path },
  };
}

export default async function RubroPage(props: PageProps<"/soluciones/[slug]">) {
  const { slug } = await props.params;
  const rubro = findRubro(slug);
  if (!rubro) notFound();

  const [image, brands] = await Promise.all([getImageSlot(rubro.imageSlot), getBrandsForRubro(rubro.slug)]);
  const others = RUBROS.filter((item) => item.slug !== rubro.slug);
  const source = rubroWhatsappSource(rubro.slug);

  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Soluciones", path: ROUTES.rubros },
          { name: rubro.name, path: ROUTES.rubro(rubro.slug) },
        ])}
      />
      <JsonLd schema={rubroSchema(rubro)} />
      <JsonLd schema={faqSchema(rubro.faqs)} />

      <PageHero eyebrow="Solución" title={rubro.seoTitle} text={rubro.summary} image={image} />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 text-pretty text-base leading-relaxed text-ink sm:text-lg">
            {rubro.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className="rounded-3xl border border-line bg-surface p-7 sm:p-8">
            <h2 className="font-condensed text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Qué incluye</h2>
            <ul className="mt-5 space-y-3">
              {rubro.subcategories.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] text-ink">
                  <FaCheck className="mt-1 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>

      {brands.length > 0 && (
        <section aria-labelledby="marcas-rubro" className="bg-surface py-16 sm:py-24">
          <Container>
            <SectionHeading eyebrow="Marcas" title={`Marcas de ${rubro.name.toLowerCase()} que trabajamos`} text="Entrá al catálogo del fabricante y consultanos por WhatsApp el modelo que necesitás." />
            <h2 id="marcas-rubro" className="sr-only">
              Marcas de la solución
            </h2>
            <div className="mt-10">
              <BrandsGrid brands={brands} source={`rubro_${rubro.slug}`} />
            </div>
          </Container>
        </section>
      )}

      <section aria-labelledby="faq-title" className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeading eyebrow="Preguntas frecuentes" title={`Lo que más nos preguntan sobre ${rubro.name.toLowerCase()}`} />
          <h2 id="faq-title" className="sr-only">
            Preguntas frecuentes
          </h2>
          <FaqList faqs={rubro.faqs} />
        </Container>
      </section>

      <WhatsappCta source={source} title={`¿Consultas sobre ${rubro.name.toLowerCase()}?`} text="Escribinos por WhatsApp con lo que necesitás y te respondemos con stock, precio y plazo de entrega." />

      <nav aria-label="Otras soluciones" className="border-t border-line bg-surface py-10">
        <Container>
          <p className="font-condensed text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">Otras soluciones</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((item) => (
              <li key={item.slug}>
                <Link href={ROUTES.rubro(item.slug)} className="pressable inline-flex min-h-11 items-center rounded-full border border-line bg-bg px-4 text-sm font-semibold text-ink hover:border-brand-400">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </>
  );
}
