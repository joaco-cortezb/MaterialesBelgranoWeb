import Image from "next/image";
import { LuArrowUpRight } from "react-icons/lu";
import type { Brand } from "@mb/shared";
import { TrackedLink } from "@/components/analytics/TrackedLink";

/**
 * Card de una marca: la misma en /marcas y en cada solución. Toda la card abre
 * el catálogo del fabricante en otra pestaña (el clic se mide con el nombre de
 * la marca). El "Ver catálogo" va siempre visible y debajo del logo, sin
 * superponerse: en celular no hay hover que lo revele.
 */
export function BrandCard({ brand, source }: { brand: Brand; source: string }) {
  return (
    <TrackedLink
      href={brand.catalogUrl}
      event="brand_click"
      params={{ brand: brand.name, source }}
      external
      aria-label={`${brand.name}: abrir catálogo en una pestaña nueva`}
      className="card-hover pressable group flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-4 sm:h-36 sm:px-5"
    >
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={`Logo de ${brand.name}`}
          width={240}
          height={120}
          sizes="150px"
          className="h-10 w-full max-w-[150px] object-contain opacity-80 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:grayscale-0 sm:h-12"
        />
      ) : (
        <span className="text-balance text-center text-base font-bold leading-tight tracking-tight text-ink-dark">{brand.name}</span>
      )}
      <span className="inline-flex items-center gap-1 font-sub text-[11px] uppercase tracking-[0.04em] text-ink-soft transition-colors duration-200 group-hover:text-brand-700">
        Ver catálogo
        <LuArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </span>
    </TrackedLink>
  );
}

/** Grilla de cards de marca: dos por fila en celular, hasta cuatro en pantallas anchas. */
export function BrandCardList({ brands, source }: { brands: Brand[]; source: string }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {brands.map((brand) => (
        <li key={brand.id}>
          <BrandCard brand={brand} source={source} />
        </li>
      ))}
    </ul>
  );
}
