import { getImageProps } from "next/image";
import { cn } from "@mb/shared";
import { Media } from "@/components/ui/Media";

/** Hasta este ancho se usa la foto de celular (mismo corte que `sm`). */
export const MOBILE_MEDIA = "(max-width: 639.98px)";

/**
 * Foto que llena su contenedor con una versión propia para celular: un
 * `<picture>` donde el navegador baja sólo la que corresponde. Sin foto de
 * celular, es igual a `Media`.
 */
export function ResponsiveMedia({
  src,
  srcMobile,
  alt,
  position = "50% 50%",
  priority = false,
  sizes = "100vw",
  quality,
  className,
}: {
  src: string;
  srcMobile?: string;
  alt: string;
  position?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  className?: string;
}) {
  if (!srcMobile) {
    return <Media src={src} alt={alt} position={position} priority={priority} sizes={sizes} quality={quality} className={className} />;
  }

  const common = { alt, fill: true, sizes, quality } as const;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src });
  const { props: mobile } = getImageProps({
    ...common,
    src: srcMobile,
    loading: priority ? "eager" : undefined,
    fetchPriority: priority ? "high" : undefined,
  });

  return (
    <div className={cn("overflow-hidden bg-surface-2", className?.includes("absolute") ? "" : "relative", className)}>
      <picture>
        <source media="(min-width: 640px)" srcSet={desktopSrcSet} sizes={sizes} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- el alt viene en `mobile` */}
        <img {...mobile} className="object-cover" style={{ ...mobile.style, objectPosition: position }} />
      </picture>
    </div>
  );
}
