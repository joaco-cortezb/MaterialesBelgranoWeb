import Image from "next/image";
import { LuArrowUpRight } from "react-icons/lu";
import type { Brand } from "@mb/shared";
import { TrackedLink } from "@/components/analytics/TrackedLink";

/**
 * Card de una marca: la misma en /marcas y en cada solución. Logo siempre a
 * color; al pasar el mouse la card se levanta y "Ver catálogo" se subraya. Toda la card abre
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
          className="h-10 w-full max-w-[150px] object-contain sm:h-12"
        />
      ) : (
        <span className="text-balance text-center text-base font-bold leading-tight tracking-tight text-ink-dark">{brand.name}</span>
      )}
      <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft transition-colors duration-200 group-hover:text-brand-700">
        <span className="link-underline">Ver catálogo</span>
        <LuArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </span>
    </TrackedLink>
  );
}

/**
 * Cards de marca: dos por fila en celular, hasta cuatro en pantallas anchas.
 * Con `center`, si la última fila queda incompleta (o hay una sola marca) las
 * cards quedan centradas en vez de pegadas a la izquierda.
 */
export function BrandCardList({ brands, source, center = false }: { brands: Brand[]; source: string; center?: boolean }) {
  if (center) {
    return (
      <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {brands.map((brand) => (
          <li key={brand.id} className="w-[calc(50%-0.375rem)] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]">
            <BrandCard brand={brand} source={source} />
          </li>
        ))}
      </ul>
    );
  }
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
