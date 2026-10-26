import Image from "next/image";
import type { Banner } from "@mb/shared";
import { BANNER_MOBILE_SIZE, BANNER_SIZE, cn } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { TrackedLink } from "@/components/analytics/TrackedLink";

/**
 * Banner del inicio: sólo imagen (el diseño ya trae su texto). Una apaisada
 * para computadora y otra para celular; todos con las mismas proporciones.
 * Si el panel le cargó un link, el banner entero abre ese link.
 */
export function HomeBanner({ banner, className }: { banner: Banner; className?: string }) {
  const [width, height] = BANNER_SIZE;
  const [mobileWidth, mobileHeight] = BANNER_MOBILE_SIZE;
  const images = (
    <>
      <Image
        src={banner.imageMobile || banner.image}
        alt={banner.title}
        width={mobileWidth}
        height={mobileHeight}
        sizes="100vw"
        quality={75}
        className="block h-auto w-full sm:hidden"
      />
      <Image
        src={banner.image}
        alt={banner.title}
        width={width}
        height={height}
        sizes="(min-width: 1280px) 1200px, 100vw"
        quality={75}
        className="hidden h-auto w-full sm:block"
      />
    </>
  );
  const boxClass =
    "block overflow-hidden rounded-2xl bg-ink-dark transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-strong)] sm:rounded-3xl";

  return (
    <section className={cn("py-8 sm:py-10", className)}>
      <Container>
        {banner.url ? (
          <TrackedLink
            href={banner.url}
            event="banner_click"
            params={{ banner: banner.key }}
            external
            className={cn(boxClass, "hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(36,38,31,0.55)]")}
          >
            {images}
          </TrackedLink>
        ) : (
          <div className={boxClass}>{images}</div>
        )}
      </Container>
    </section>
  );
}
