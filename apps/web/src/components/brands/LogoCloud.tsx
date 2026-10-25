import Image from "next/image";
import type { Brand } from "@mb/shared";
import { cn } from "@mb/shared";
import { TrackedLink } from "@/components/analytics/TrackedLink";

/**
 * Grilla de logos con divisores de 1px (adaptación del "logo cloud": celdas
 * pegadas sobre un fondo de línea). Se completa con celdas vacías para que la
 * última fila cierre pareja con cualquier cantidad de marcas.
 * Cada logo abre el catálogo del fabricante; el clic se mide en GA4.
 */
export function LogoCloud({ brands, source, className }: { brands: Brand[]; source: string; className?: string }) {
  const withLogo = brands.filter((brand) => brand.logo);
  if (withLogo.length === 0) return null;

  const padMobile = (2 - (withLogo.length % 2)) % 2;
  const padDesktop = (4 - (withLogo.length % 4)) % 4;

  return (
    <div className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4", className)}>
      {withLogo.map((brand) => (
        <TrackedLink
          key={brand.id}
          href={brand.catalogUrl}
          event="brand_click"
          params={{ brand: brand.name, source }}
          external
          aria-label={`${brand.name}: abrir catálogo en una pestaña nueva`}
          className="group flex h-24 items-center justify-center bg-surface px-6 transition-colors duration-200 hover:bg-bg sm:h-28 sm:px-8"
        >
          <Image
            src={brand.logo}
            alt={`Logo de ${brand.name}`}
            width={240}
            height={120}
            sizes="(min-width: 768px) 200px, 45vw"
            className="h-9 w-full max-w-[140px] object-contain opacity-80 grayscale transition-[filter,opacity,transform] duration-300 ease-[var(--ease-out-strong)] group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 sm:h-10"
          />
        </TrackedLink>
      ))}
      {Array.from({ length: Math.max(padMobile, padDesktop) }).map((_, index) => (
        <div
          key={`pad-${index}`}
          aria-hidden
          className={cn("bg-surface", index < padMobile ? "block" : "hidden", index < padDesktop ? "md:block" : "md:hidden")}
        />
      ))}
    </div>
  );
}
