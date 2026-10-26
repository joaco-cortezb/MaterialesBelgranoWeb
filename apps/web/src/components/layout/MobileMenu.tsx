"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { FaWhatsapp } from "react-icons/fa6";
import { cn, SITE } from "@mb/shared";
import { buttonClassName } from "@/components/ui/Button";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { NavLinks } from "@/components/layout/NavLinks";

type NavLink = { href: string; label: string };

/**
 * Menú hamburguesa accesible: `aria-expanded`/`aria-controls`, panel con
 * `role="dialog"`, cierra con Escape y al navegar, bloquea el scroll del body
 * y respeta `safe-area-inset-bottom`. Se despliega como una cortina de arriba
 * hacia abajo y los ítems entran escalonados (`mobile-menu` en globals.css).
 */
export function MobileMenu({ links, whatsappHref }: { links: readonly NavLink[]; whatsappHref: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="pressable flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-ink lg:hidden"
      >
        <span className="relative block h-4 w-5" aria-hidden>
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={cn(
                "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-[transform,opacity] duration-200 ease-[var(--ease-out-strong)]",
                index === 0 && (open ? "top-[7px] rotate-45" : "top-0"),
                index === 1 && (open ? "top-[7px] opacity-0" : "top-[7px]"),
                index === 2 && (open ? "top-[7px] -rotate-45" : "top-[14px]"),
              )}
            />
          ))}
        </span>
      </button>

      {mounted &&
        createPortal(
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            inert={!open}
            data-open={open || undefined}
            className={cn(
              "mobile-menu fixed inset-x-0 bottom-0 top-[65px] z-50 flex flex-col overflow-y-auto overscroll-contain bg-surface px-4 pt-4 lg:hidden",
              !open && "pointer-events-none",
            )}
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
          >
            <div className="mobile-menu-item" style={{ "--i": 0 } as React.CSSProperties}>
              <NavLinks links={links} orientation="vertical" onNavigate={() => setOpen(false)} />
            </div>

            <div className="mobile-menu-item mt-6 space-y-3 border-t border-line pt-6" style={{ "--i": 1 } as React.CSSProperties}>
              <TrackedLink
                href={whatsappHref}
                event="whatsapp_click"
                params={{ source: "header" }}
                className={buttonClassName({ variant: "whatsapp", size: "lg", className: "w-full" })}
              >
                <FaWhatsapp className="h-5 w-5" aria-hidden />
                Consultar por WhatsApp
              </TrackedLink>
              <TrackedLink
                href={SITE.distribuidora370.url}
                event="distribuidora_click"
                params={{ source: "menu" }}
                external
                className={buttonClassName({ variant: "outline", size: "lg", className: "w-full" })}
              >
                Tienda online: {SITE.distribuidora370.name}
              </TrackedLink>
            </div>

            <p className="mobile-menu-item mt-auto pt-8 text-center text-sm text-ink-soft" style={{ "--i": 2 } as React.CSSProperties}>
              {SITE.address.singleLine}
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
