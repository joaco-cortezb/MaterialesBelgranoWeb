import type { Metadata } from "next";
import { ROUTES, SERVICIOS, SITE, cn } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { PageHero } from "@/components/sections/PageHero";
import { WhatsappCta } from "@/components/sections/WhatsappCta";
import { ServicioIcon } from "@/components/servicios/ServicioIcon";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, servicesSchema } from "@/lib/structured-data";
import { getImageSlots } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Servicios: entrega en 24 hs, financiación y cuenta corriente",
  description:
    "Transporte propio con entrega en 24 hs en Mendoza, San Juan y San Luis, envíos a todo el país por Andreani, financiación, cuenta corriente y stock amplio.",
  alternates: { canonical: ROUTES.servicios },
  openGraph: { title: `Servicios | ${SITE.name}`, url: ROUTES.servicios },
};

export default async function ServiciosPage() {
  const images = await getImageSlots(["servicios.hero", ...SERVICIOS.map((servicio) => servicio.imageSlot)]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: "Servicios", path: ROUTES.servicios }])} />
      <JsonLd schema={servicesSchema(SERVICIOS)} />
      <PageHero
        eyebrow="Servicios"
        title="Precio competitivo, y además todo lo que una obra necesita que funcione"
        text="Los materiales son los mismos en todos lados. La diferencia está en el stock, la logística y la atención."
        image={images["servicios.hero"]}
      />

      <section className="py-16 sm:py-24">
        <Container className="space-y-6">
          {SERVICIOS.map((servicio, index) => {
            const image = images[servicio.imageSlot];
            const reversed = index % 2 === 1;
            return (
              <article
                key={servicio.slug}
                id={servicio.slug}
                className={cn(
                  "grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-2",
                  reversed && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div className="relative min-h-56 lg:min-h-80">
                  {image ? (
                    <Media src={image.url} alt={image.alt} position={image.position} sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-ink-dark">
                      <ServicioIcon icon={servicio.icon} className="h-20 w-20 opacity-80" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
                    <ServicioIcon icon={servicio.icon} className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 text-balance text-2xl font-extrabold tracking-tight text-ink-dark sm:text-3xl">{servicio.title}</h2>
                  <p className="mt-4 text-pretty text-base leading-relaxed text-ink sm:text-lg">{servicio.description}</p>
                  {servicio.detail && (
                    <p className="mt-3 rounded-lg bg-accent/40 px-3 py-2 text-sm text-ink-soft">{servicio.detail}</p>
                  )}
                </div>
              </article>
            );
          })}
        </Container>
      </section>

      <WhatsappCta
        source="servicios"
        title="¿Querés abrir una cuenta corriente o cotizar un envío?"
        text="Escribinos por WhatsApp y te contamos requisitos, plazos y costos para tu zona."
      />
    </>
  );
}
