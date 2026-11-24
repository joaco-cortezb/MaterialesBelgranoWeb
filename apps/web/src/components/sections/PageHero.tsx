import type { ImageSlot } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { ResponsiveMedia } from "@/components/ui/ResponsiveMedia";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Portada de las páginas interiores: foto (o fondo oscuro) con el título
 * centrado. `imageMobile` es otra foto para celular (vertical), opcional.
 */
export function PageHero({
  eyebrow,
  title,
  text,
  image,
  imageMobile,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  image: ImageSlot | null;
  imageMobile?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-dark text-white">
      {image ? (
        <ResponsiveMedia
          src={image.url}
          srcMobile={imageMobile}
          alt={image.alt}
          position={image.position}
          priority
          sizes="100vw"
          quality={75}
          className="absolute inset-0 -z-10"
        />
      ) : (
        <div aria-hidden className="brand-slabs absolute inset-0 -z-10" />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-dark via-ink-dark/75 to-ink-dark/40" />
      <Container className="py-20 sm:py-28">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} text={text} light align="center" className="max-w-3xl" />
      </Container>
    </section>
  );
}
