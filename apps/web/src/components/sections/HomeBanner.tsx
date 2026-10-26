import { getImageProps } from "next/image";
import type { Banner } from "@mb/shared";
import { BANNER_MOBILE_SIZE, BANNER_SIZE, cn } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { TrackedLink } from "@/components/analytics/TrackedLink";

/** `sizes` de cada versión (los usa también la precarga de imágenes). */
export const BANNER_SIZES = {
  desktop: "(min-width: 1280px) 1200px, calc(100vw - 4rem)",
  mobile: "calc(100vw - 2rem)",
} as const;

/**
 * Banner: sólo imagen (el diseño ya trae su texto). Un `<picture>` con la
 * versión de celular y la de computadora: el navegador baja una sola. Se
 * pide sin esperar a que el usuario llegue (prioridad baja), así ya está
 * cuando aparece. Si el panel le cargó un link, el banner entero lo abre.
 */
export function HomeBanner({ banner, className }: { banner: Banner; className?: string }) {
  const [width, height] = BANNER_SIZE;
  const [mobileWidth, mobileHeight] = BANNER_MOBILE_SIZE;
  const common = { alt: banner.title, quality: 85 } as const;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: banner.image, width, height, sizes: BANNER_SIZES.desktop });
  const { props: mobile } = getImageProps({
    ...common,
    src: banner.imageMobile || banner.image,
    width: mobileWidth,
    height: mobileHeight,
    sizes: BANNER_SIZES.mobile,
    loading: "eager",
    fetchPriority: "low",
  });

  const picture = (
    <picture>
      <source media="(min-width: 640px)" srcSet={desktopSrcSet} sizes={BANNER_SIZES.desktop} width={width} height={height} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- el alt viene en `mobile` */}
      <img {...mobile} className="block h-auto w-full" />
    </picture>
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
            {picture}
          </TrackedLink>
        ) : (
          <div className={boxClass}>{picture}</div>
        )}
      </Container>
    </section>
  );
}
