import type { Metadata } from "next";
import { FaWarehouse } from "react-icons/fa6";
import { ROUTES, SITE, type ImageSlot } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { PageBanner } from "@/components/sections/PageBanner";
import { ContactSection } from "@/components/contact/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getAboutContent, getDefaultWhatsapp, getHeroSlides, getImageSlots, getWhatsappNumbers } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Nosotros y contacto",
  description: `Casi 10 años como casa de materiales eléctricos e iluminación en ${SITE.address.singleLine}. Salón moderno, depósito con stock permanente, equipo joven. Horarios, WhatsApp y mapa.`,
  alternates: { canonical: ROUTES.nosotros },
  openGraph: { title: `Nosotros y contacto | ${SITE.name}`, url: ROUTES.nosotros },
};

const GALLERY = [
  { key: "nosotros.salon", title: "Salón de ventas" },
  { key: "nosotros.deposito", title: "Depósito" },
  { key: "nosotros.equipo", title: "Equipo" },
] as const;

const FACTS = [
  { value: `Desde ${SITE.foundedYear}`, label: "en Godoy Cruz, Mendoza" },
  { value: "+5.000", label: "artículos en stock" },
  { value: "24 hs", label: "entrega con transporte propio" },
];

export default async function NosotrosPage() {
  const [about, slides, images, numbers, fallback] = await Promise.all([
    getAboutContent(),
    getHeroSlides("nosotros"),
    getImageSlots(GALLERY.map((item) => item.key)),
    getWhatsappNumbers(),
    getDefaultWhatsapp(),
  ]);
  const whatsapps = numbers.length > 0 ? numbers : [fallback];

  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: "Nosotros", path: ROUTES.nosotros }])} />
      <PageBanner slides={slides} eyebrow="Nosotros" title={about.headline} />

      {/* Historia: poco texto, centrado, con tres datos que la resumen. */}
      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl text-center">
          <Eyebrow>Nuestra historia</Eyebrow>
          <div className="mt-5 space-y-4 text-pretty text-lg leading-relaxed text-ink sm:text-xl">
            {about.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-4 border-y border-line py-10">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="sr-only">{fact.label}</dt>
                <dd className="font-condensed text-3xl font-bold tracking-tight text-brand-700 sm:text-5xl">{fact.value}</dd>
                <dd className="mt-1 text-xs text-ink-soft sm:text-sm">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Fotos del negocio en mosaico, sin cards de texto. */}
      <section aria-labelledby="galeria-title" className="pb-16 sm:pb-24">
        <Container>
          <h2 id="galeria-title" className="sr-only">
            El negocio por dentro
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:grid-rows-2">
            {GALLERY.map((item, index) => (
              <GalleryTile key={item.key} title={item.title} image={images[item.key]} large={index === 0} />
            ))}
          </ul>
        </Container>
      </section>

      <ContactSection whatsapps={whatsapps} />
    </>
  );
}

function GalleryTile({ title, image, large }: { title: string; image: ImageSlot | null; large: boolean }) {
  return (
    <li
      className={
        large
          ? "relative aspect-[4/3] overflow-hidden rounded-3xl bg-surface-2 sm:col-span-2 lg:row-span-2 lg:aspect-auto lg:min-h-[480px]"
          : "relative aspect-[4/3] overflow-hidden rounded-3xl bg-surface-2"
      }
    >
      {image ? (
        <Media
          src={image.url}
          alt={image.alt}
          position={image.position}
          sizes={large ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="absolute inset-0"
        />
      ) : (
        <BrandPlaceholder icon={<FaWarehouse />} />
      )}
      <span className="absolute bottom-4 left-4 rounded-full bg-ink-dark/75 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">{title}</span>
    </li>
  );
}
