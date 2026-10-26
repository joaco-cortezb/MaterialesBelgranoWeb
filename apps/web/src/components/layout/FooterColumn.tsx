"use client";

import { useId, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { cn } from "@mb/shared";

/**
 * Columna de datos del footer. En celular es un acordeón (cerrado de
 * entrada, se abre tocando el título); desde `sm` siempre está abierta y el
 * título es texto común.
 */
export function FooterColumn({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="min-w-0 border-b border-white/10 sm:border-0">
      <h2>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={contentId}
          className="flex min-h-12 w-full items-center justify-between gap-3 text-left font-condensed text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-400 sm:pointer-events-none sm:min-h-0 sm:cursor-default"
        >
          {label}
          <FaChevronDown
            aria-hidden
            className={cn("h-3 w-3 shrink-0 transition-transform duration-300 ease-[var(--ease-out-strong)] sm:hidden", open && "rotate-180")}
          />
        </button>
      </h2>
      {/* Grid 0fr → 1fr: anima el alto sin medirlo. En `sm` siempre abierto. */}
      <div
        id={contentId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-strong)] sm:grid-rows-[1fr]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-2 pb-4 text-[15px] leading-relaxed text-white/85 sm:mt-3 sm:pb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
