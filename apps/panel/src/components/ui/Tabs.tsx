"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Ids de pestaña y panel para un `Tabs` con `id`. */
export function tabIds(id: string, value: string) {
  return { tab: `${id}-tab-${value}`, panel: `${id}-panel` };
}

/**
 * Menú de pestañas centrado y compacto (píldoras sobre un fondo suave).
 * Teclado: sólo la pestaña elegida entra en el Tab; las flechas, Inicio y Fin
 * cambian de pestaña. El contenido va en un `role="tabpanel"` con
 * `tabIds(id, value).panel` como id.
 */
export function Tabs<T extends string>({
  id,
  items,
  value,
  onChange,
  label,
  className,
}: {
  id: string;
  items: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(event: React.KeyboardEvent) {
    const index = items.findIndex((item) => item.value === value);
    let next = -1;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next < 0) return;
    event.preventDefault();
    onChange(items[next].value);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return (
    <div className={cn("mb-6 flex justify-center", className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 shadow-[0_1px_2px_rgba(36,38,31,0.05)]"
      >
        {items.map((item) => {
          const selected = item.value === value;
          const ids = tabIds(id, item.value);
          return (
            <button
              key={item.value}
              id={ids.tab}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={ids.panel}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.value)}
              className={cn(
                "min-h-10 shrink-0 rounded-full px-5 text-sm font-semibold transition-colors duration-150 pointer-coarse:min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/60",
                selected ? "bg-sidebar text-white" : "text-ink-soft hover:bg-surface-2 hover:text-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
