import Image from "next/image";
import type { Banner } from "@mb/shared";
import { BANNER_SIZE, cn } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { TrackedLink } from "@/components/analytics/TrackedLink";

/**
 * Banner del inicio: sólo la imagen (el diseño ya trae su texto), todos con
 * la misma proporción. Si el panel le cargó un link, toda la imagen es el link.
 */
export function HomeBanner({ banner, className }: { banner: Banner; className?: string }) {
  const [width, height] = BANNER_SIZE;
  const image = (
    <Image
      src={banner.image}
      alt={banner.title}
      width={width}
      height={height}
      sizes="(min-width: 1280px) 1200px, 100vw"
      quality={75}
      className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.02]"
    />
  );
  const boxClass = "group block overflow-hidden rounded-3xl bg-ink-dark shadow-[0_24px_50px_-30px_rgba(36,38,31,0.6)]";
  const external = /^https?:\/\//.test(banner.url);

  return (
    <section className={cn("py-8 sm:py-12", className)}>
      <Container>
        <div style={{ aspectRatio: `${width} / ${height}` }}>
          {banner.url ? (
            <TrackedLink href={banner.url} event="banner_click" params={{ banner: banner.key }} external={external} className={cn(boxClass, "h-full")}>
              {image}
            </TrackedLink>
          ) : (
            <div className={cn(boxClass, "h-full")}>{image}</div>
          )}
        </div>
      </Container>
    </section>
  );
}
