import type { ImageSlot } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Portada de las páginas interiores: foto del slot (o fondo oscuro) + título. */
export function PageHero({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  image: ImageSlot | null;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-dark text-white">
      {image && (
        <Media
          src={image.url}
          alt={image.alt}
          position={image.position}
          priority
          sizes="100vw"
          quality={70}
          className="absolute inset-0 -z-10"
        />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-dark via-ink-dark/75 to-ink-dark/40" />
      <Container className="py-20 sm:py-28">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} text={text} light />
      </Container>
    </section>
  );
}
