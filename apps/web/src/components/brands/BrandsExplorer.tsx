"use client";

import { useState } from "react";
import type { Brand } from "@mb/shared";
import { cn } from "@mb/shared";
import { BrandCardList } from "@/components/brands/BrandCard";
import { RubroIcon } from "@/components/rubros/RubroIcon";

type Group = { slug: string; name: string; brands: Brand[] };

/**
 * Marcas agrupadas por solución, con filtros arriba. Los filtros son botones
 * con `aria-pressed` (no pestañas: no hay paneles que cambien, sólo se acota
 * la lista). Cada card entera abre el catálogo del fabricante.
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
        <div role="group" aria-label="Filtrar marcas por solución" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          <Chip selected={active === "todas"} onClick={() => setActive("todas")}>
            Todas <span className="tabular-nums opacity-60">{total}</span>
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
              <h2 id={`marcas-${group.slug}`} className="text-base font-bold tracking-tight text-ink-dark sm:text-lg">
                {group.name}
              </h2>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
            <div className="mt-5">
              <BrandCardList brands={group.brands} source="marcas" />
            </div>
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
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "pressable inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold",
        selected ? "border-ink-dark bg-ink-dark text-white" : "border-line bg-surface text-ink-dark hover:border-ink-dark/40",
      )}
    >
      {children}
    </button>
  );
}
