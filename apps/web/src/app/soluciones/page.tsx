import type { Metadata } from "next";
import { ROUTES, RUBROS, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RubroCard } from "@/components/rubros/RubroCard";
import { WhatsappCta } from "@/components/sections/WhatsappCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getImageSlots } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Soluciones: materiales eléctricos, iluminación, herramientas, smart y cámaras",
  description:
    "Las cinco soluciones de Materiales Belgrano en Mendoza: materiales eléctricos, iluminación, máquinas y herramientas, dispositivos smart y cámaras de videovigilancia.",
  alternates: { canonical: ROUTES.rubros },
  openGraph: { title: `Soluciones | ${SITE.name}`, url: ROUTES.rubros },
};

export default async function RubrosPage() {
  const images = await getImageSlots(RUBROS.map((rubro) => rubro.imageSlot));

  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: "Soluciones", path: ROUTES.rubros }])} />
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Soluciones"
            title="Todo lo que lleva una instalación, en un solo proveedor"
            text="Materiales Belgrano trabaja cinco soluciones: materiales eléctricos, iluminación, máquinas y herramientas, dispositivos smart y cámaras. Cada página explica qué encontrás, con qué marcas y responde las preguntas más frecuentes. Lo puntual se resuelve por WhatsApp."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RUBROS.map((rubro) => (
              <RubroCard key={rubro.slug} rubro={rubro} image={images[rubro.imageSlot]} />
            ))}
          </div>
        </Container>
      </section>
      <WhatsappCta source="inicio" title="¿No sabés en qué solución está lo que buscás?" text="Mandanos una foto o el nombre del producto por WhatsApp y te decimos si lo tenemos." />
    </>
  );
}
