"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { FaWhatsapp } from "react-icons/fa6";
import { cn, SITE } from "@mb/shared";
import { buttonClassName } from "@/components/ui/Button";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { NavLinks } from "@/components/layout/NavLinks";

type NavLink = { href: string; label: string };

/**
 * Menú hamburguesa accesible: desplegable de navegación (no un diálogo: el
 * botón que lo cierra queda afuera, en el header) con `aria-expanded`/
 * `aria-controls`. Cierra con Escape (y devuelve el foco al botón), al navegar
 * y al pasar a pantalla de computadora; bloquea el scroll del body y respeta
 * `safe-area-inset-bottom`. Se despliega como una cortina de arriba hacia
 * abajo y los ítems entran escalonados (`mobile-menu` en globals.css).
 */
export function MobileMenu({ links, whatsappHref }: { links: readonly NavLink[]; whatsappHref: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

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
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    // Desde `lg` el menú no se ve: si la ventana se agranda con el menú
    // abierto, se cierra para no dejar el body sin scroll.
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="pressable flex h-11 w-11 items-center justify-center rounded-full bg-ink-dark/[0.06] text-ink-dark lg:hidden"
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
          <nav
            id={panelId}
            aria-label="Menú de navegación"
            inert={!open}
            data-open={open || undefined}
            className={cn(
              "mobile-menu fixed inset-x-0 bottom-0 top-[65px] z-50 sm:top-[81px] flex flex-col overflow-y-auto overscroll-contain bg-surface px-4 pt-4 lg:hidden",
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
          </nav>,
          document.body,
        )}
    </>
  );
}
