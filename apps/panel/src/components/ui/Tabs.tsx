"use client";

import { cn } from "@/lib/utils";

/** Menú de pestañas centrado y compacto (píldoras sobre un fondo suave). */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  className,
}: {
  items: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex justify-center", className)}>
      <div role="tablist" aria-label={label} className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 shadow-[0_1px_2px_rgba(36,38,31,0.05)]">
        {items.map((item) => {
          const selected = item.value === value;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(item.value)}
              className={cn(
                "min-h-10 shrink-0 rounded-full px-5 text-sm font-semibold transition-colors",
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
