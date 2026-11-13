"use client";

import { useId, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { cn } from "@mb/shared";

/**
 * Columna de datos del footer. En celular es un acordeón (cerrado de
 * entrada, se abre tocando el título); desde `sm` siempre está abierta y el
 * título es texto común (el botón sólo existe en celular). Cerrada, los links
 * quedan `invisible` para que el teclado no pase por ellos.
 */
export function FooterColumn({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="min-w-0 border-b border-white/10 sm:border-0">
      <h2 className="font-sub text-[11px] uppercase tracking-[0.04em] text-brand-400">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={contentId}
          className="flex min-h-12 w-full items-center justify-between gap-3 text-left uppercase sm:hidden"
        >
          {label}
          <FaChevronDown
            aria-hidden
            className={cn("h-3 w-3 shrink-0 transition-transform duration-300 ease-[var(--ease-out-strong)]", open && "rotate-180")}
          />
        </button>
        <span className="hidden sm:block">{label}</span>
      </h2>
      {/* Grid 0fr → 1fr: anima el alto sin medirlo. En `sm` siempre abierto.
          `visibility` también transiciona: al cerrar se oculta recién al final. */}
      <div
        id={contentId}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-300 ease-[var(--ease-out-strong)] sm:visible sm:grid-rows-[1fr]",
          open ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-2 pb-4 text-[15px] leading-relaxed text-white/85 sm:mt-3 sm:pb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
