import Image from "next/image";
import type { Brand } from "@mb/shared";
import { cn } from "@mb/shared";
import { TrackedLink } from "@/components/analytics/TrackedLink";

/** Mínimo de logos por tramo para que la cinta cubra pantallas anchas sin huecos. */
const MIN_PER_RUN = 8;

/**
 * Dos cintas de logos que se desplazan en sentidos opuestos, sin fin.
 * Las marcas se reparten entre las dos filas; cada fila repite su tramo para
 * que el loop no tenga salto (la animación corre -50%). Se pausa al pasar el
 * mouse o al enfocar un logo, y con `prefers-reduced-motion` queda quieta.
 */
export function LogoMarquee({ brands, source, className }: { brands: Brand[]; source: string; className?: string }) {
  const withLogo = brands.filter((brand) => brand.logo);
  if (withLogo.length === 0) return null;

  const half = Math.ceil(withLogo.length / 2);
  const rows = withLogo.length < 6 ? [withLogo, withLogo] : [withLogo.slice(0, half), withLogo.slice(half)];

  return (
    <div className={cn("marquee-mask space-y-3 sm:space-y-4", className)}>
      {rows.map((row, index) => (
        <MarqueeRow key={index} brands={row} source={source} reverse={index === 1} />
      ))}
    </div>
  );
}

function MarqueeRow({ brands, source, reverse }: { brands: Brand[]; source: string; reverse: boolean }) {
  const run: Brand[] = [];
  while (run.length < MIN_PER_RUN) run.push(...brands);

  return (
    <div className="marquee group flex overflow-hidden" data-reverse={reverse || undefined}>
      {[0, 1].map((copy) => (
        <ul key={copy} aria-hidden={copy === 1 || undefined} className="marquee-track flex shrink-0 items-center gap-3 pr-3 sm:gap-4 sm:pr-4">
          {run.map((brand, index) => (
            <li key={`${brand.id}-${index}`}>
              <TrackedLink
                href={brand.catalogUrl}
                event="brand_click"
                params={{ brand: brand.name, source }}
                external
                tabIndex={copy === 1 || index >= brands.length ? -1 : undefined}
                aria-label={`${brand.name}: abrir catálogo en una pestaña nueva`}
                className="group/logo flex h-24 w-48 items-center justify-center rounded-2xl border border-line bg-surface px-6 transition-[border-color,box-shadow] duration-200 hover:border-brand-300 hover:shadow-[0_10px_24px_-16px_rgba(36,38,31,0.35)] sm:h-32 sm:w-64 sm:px-9"
              >
                <Image
                  src={brand.logo}
                  alt={copy === 1 ? "" : `Logo de ${brand.name}`}
                  width={240}
                  height={120}
                  sizes="256px"
                  className="h-11 w-full object-contain opacity-75 grayscale transition-[filter,opacity] duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 sm:h-14"
                />
              </TrackedLink>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
