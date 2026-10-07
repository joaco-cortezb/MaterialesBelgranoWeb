import Image from "next/image";
import type { Brand } from "@mb/shared";
import { TrackedLink } from "@/components/analytics/TrackedLink";

/**
 * Grilla de logos. Cada marca abre el catálogo del fabricante en otra pestaña;
 * el clic se mide en GA4 con el nombre de la marca.
 */
export function BrandsGrid({ brands, source }: { brands: Brand[]; source: string }) {
  if (brands.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-surface px-6 py-10 text-center text-sm text-ink-soft">
        Las marcas se cargan desde el panel de administración. {/* TODO(cliente): logos y catálogos */}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {brands.map((brand) => (
        <li key={brand.id}>
          <TrackedLink
            href={brand.catalogUrl}
            event="brand_click"
            params={{ brand: brand.name, source }}
            external
            aria-label={`${brand.name}: abrir catálogo en una pestaña nueva`}
            className="card-hover pressable flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface p-5"
          >
            {brand.logo ? (
              <Image
                src={brand.logo}
                alt={`Logo de ${brand.name}`}
                width={240}
                height={120}
                sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
                className="h-12 w-auto max-w-[160px] object-contain"
              />
            ) : (
              <span className="text-center text-base font-bold tracking-tight text-ink-dark">{brand.name}</span>
            )}
            <span className="font-condensed text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Ver catálogo ↗
            </span>
          </TrackedLink>
        </li>
      ))}
    </ul>
  );
}
