"use client";

import Image from "next/image";
import { useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import type { Brand } from "@mb/shared";
import { cn } from "@mb/shared";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { RubroIcon } from "@/components/rubros/RubroIcon";

type Group = { slug: string; name: string; brands: Brand[] };

/**
 * Marcas agrupadas por solución, con filtros arriba. Cada card entera abre el
 * catálogo del fabricante; la etiqueta de abajo dice a qué solución pertenece.
 */
export function BrandsExplorer({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState<string>("todas");
  const visible = active === "todas" ? groups : groups.filter((group) => group.slug === active);
  const total = groups.reduce((sum, group) => sum + group.brands.length, 0);

  if (total === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-surface px-6 py-10 text-center text-sm text-ink-soft">
        Las marcas se cargan desde el panel de administración.
      </p>
    );
  }

  return (
    <div>
      {groups.length > 1 && (
        <div role="tablist" aria-label="Filtrar marcas por solución" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          <Chip selected={active === "todas"} onClick={() => setActive("todas")}>
            Todas <span className="opacity-60">{total}</span>
          </Chip>
          {groups.map((group) => (
            <Chip key={group.slug} selected={active === group.slug} onClick={() => setActive(group.slug)}>
              {group.slug !== "otras" && <RubroIcon slug={group.slug} className="h-3.5 w-3.5" />}
              {group.name}
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-10 space-y-12">
        {visible.map((group) => (
          <section key={group.slug} aria-labelledby={`marcas-${group.slug}`}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-ink-dark">
                <RubroIcon slug={group.slug} className="h-4 w-4" />
              </span>
              <h2 id={`marcas-${group.slug}`} className="text-lg font-bold tracking-tight text-ink-dark sm:text-xl">
                {group.name}
              </h2>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {group.brands.map((brand) => (
                <li key={brand.id}>
                  <TrackedLink
                    href={brand.catalogUrl}
                    event="brand_click"
                    params={{ brand: brand.name, source: "marcas" }}
                    external
                    aria-label={`${brand.name}: abrir catálogo en una pestaña nueva`}
                    className="group relative flex h-32 flex-col items-center justify-center rounded-2xl border border-line bg-surface px-5 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-strong)] hover:-translate-y-1 hover:border-brand-400 hover:shadow-[0_18px_36px_-20px_rgba(36,38,31,0.4)] sm:h-36"
                  >
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={`Logo de ${brand.name}`}
                        width={240}
                        height={120}
                        sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
                        className="h-10 w-full max-w-[150px] object-contain opacity-80 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:h-12"
                      />
                    ) : (
                      <span className="text-center text-base font-bold tracking-tight text-ink-dark">{brand.name}</span>
                    )}
                    <span className="absolute inset-x-0 bottom-3 text-center font-condensed text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      Catálogo de {brand.name}
                    </span>
                    <span
                      aria-hidden
                      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-ink-soft transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-ink-dark"
                    >
                      <LuArrowUpRight className="h-4 w-4" />
                    </span>
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "pressable inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold",
        selected ? "border-ink-dark bg-ink-dark text-white" : "border-line bg-surface text-ink-dark hover:border-ink-dark/40",
      )}
    >
      {children}
    </button>
  );
}
