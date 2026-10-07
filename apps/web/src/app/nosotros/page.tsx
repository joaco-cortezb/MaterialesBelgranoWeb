import type { Metadata } from "next";
import { ROUTES, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { WhatsappCta } from "@/components/sections/WhatsappCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getAboutContent, getImageSlots } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Casi 10 años como casa de materiales eléctricos e iluminación en Godoy Cruz, Mendoza. Salón moderno, depósito con stock permanente y un equipo joven que asesora.",
  alternates: { canonical: ROUTES.nosotros },
  openGraph: { title: `Nosotros | ${SITE.name}`, url: ROUTES.nosotros },
};

const GALLERY = [
  { key: "nosotros.salon", title: "Salón de ventas", text: "Renovado por completo para que elegir sea cómodo: exhibición de iluminación encendida y atención sin mostrador tradicional." },
  { key: "nosotros.deposito", title: "Depósito", text: "Stock permanente y ordenado de cables, cañerías, tableros y luminarias, listo para despachar en el día." },
  { key: "nosotros.equipo", title: "Equipo", text: "Un equipo joven y capacitado, con menos de 30 años de promedio, que resuelve en el salón o por WhatsApp." },
] as const;

export default async function NosotrosPage() {
  const [about, images] = await Promise.all([
    getAboutContent(),
    getImageSlots(["nosotros.hero", ...GALLERY.map((item) => item.key)]),
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: "Nosotros", path: ROUTES.nosotros }])} />
      <PageHero
        eyebrow="Nosotros"
        title={about.headline}
        text={`Materiales eléctricos e iluminación en ${SITE.address.locality}, ${SITE.address.region}, para instaladores, empresas y hogares.`}
        image={images["nosotros.hero"]}
      />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading eyebrow="Nuestra historia" title="Crecimos por recomendación, no por publicidad" />
          <div className="space-y-5 text-pretty text-base leading-relaxed text-ink sm:text-lg">
            {about.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="galeria-title" className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="El negocio"
            title="Tamaño, orden y stock: lo que ves cuando entrás"
            text="Un negocio se conoce por su depósito. El nuestro está ordenado, con stock permanente y listo para despachar en el día."
          />
          <h2 id="galeria-title" className="sr-only">
            Galería
          </h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {GALLERY.map((item) => {
              const image = images[item.key];
              return (
                <li key={item.key} className="overflow-hidden rounded-2xl border border-line bg-bg">
                  <div className="relative aspect-[4/3]">
                    {image ? (
                      <Media src={image.url} alt={image.alt} position={image.position} sizes="(min-width: 768px) 30vw, 92vw" className="absolute inset-0" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-300" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold tracking-tight text-ink-dark">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <dl className="grid gap-6 rounded-3xl border border-line bg-surface p-8 sm:grid-cols-3 sm:p-10">
            <Fact value={`Desde ${SITE.foundedYear}`} label="en Godoy Cruz, Mendoza" />
            <Fact value="3 públicos" label="instaladores, empresas y consumidor final" />
            <Fact value="50 %" label="de las ventas en cuenta corriente a clientes frecuentes" />
          </dl>
        </Container>
      </section>

      <WhatsappCta source="nosotros" title="Pasá a conocernos o escribinos por WhatsApp." text={`${SITE.address.singleLine}. ${SITE.hours.map((slot) => `${slot.days} de ${slot.opens} a ${slot.closes} hs`).join(" · ")}.`} />
    </>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-condensed text-4xl font-bold tracking-tight text-brand-700">{value}</dd>
      <dd className="mt-1 text-sm text-ink-soft">{label}</dd>
    </div>
  );
}
