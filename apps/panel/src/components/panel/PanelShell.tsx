"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { canViewSection } from "@/lib/permissions";
import type { Role } from "@/generated/prisma";
import { NAV_ITEMS } from "./nav";

function isActive(pathname: string, href: string): boolean {
  if (href === "/panel") return pathname === "/panel";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type User = { name: string; email: string; role: string };

const SIDEBAR_WIDTH = 248;

// Botones sobre el fondo oscuro: 44 px, foco visible en verde.
const DARK_ICON_BUTTON =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400";

export function PanelShell({ user, role, webUrl, children }: { user: User; role: Role; webUrl: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // En celular el menú cerrado queda fuera de pantalla: también se saca del
  // foco del teclado y de los lectores de pantalla (`inert`).
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    queueMicrotask(() => setMobileOpen(false));
  }, [pathname]);

  // Al abrir el menú el foco entra en él; al cerrarlo vuelve al botón de menú.
  useEffect(() => {
    if (mobileOpen) closeButtonRef.current?.focus();
    else if (wasOpen.current && !isDesktop) openButtonRef.current?.focus({ preventScroll: true });
    wasOpen.current = mobileOpen;
  }, [mobileOpen, isDesktop]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  // El navegador puede restaurar una página protegida desde bfcache después
  // del logout: se confirma la sesión al volver a mostrarla.
  useEffect(() => {
    function verifyRestoredSession(event: PageTransitionEvent) {
      if (!event.persisted) return;
      void createClient()
        .auth.getSession()
        .then(({ data }) => {
          if (!data.session) window.location.replace("/login");
        });
    }
    window.addEventListener("pageshow", verifyRestoredSession);
    return () => window.removeEventListener("pageshow", verifyRestoredSession);
  }, []);

  const navItems = NAV_ITEMS.filter((item) => !item.section || canViewSection(role, item.section));
  const currentLabel = navItems.find((item) => isActive(pathname, item.href))?.label ?? "Panel";

  return (
    <div className="min-h-screen">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-surface focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
      >
        Saltar al contenido
      </a>
      <aside
        id="panel-menu"
        aria-label="Navegación del panel"
        inert={!isDesktop && !mobileOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[min(100%,320px)] flex-col bg-sidebar text-white transition-transform duration-200 ease-[var(--ease-out-strong)] motion-reduce:transition-none lg:w-[var(--w)] lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ "--w": `${SIDEBAR_WIDTH}px` } as React.CSSProperties}
      >
        <div className="flex h-[72px] items-center justify-between px-5">
          <Link href="/panel" className="flex items-center gap-3 rounded-lg" aria-label="Ir al inicio del panel">
            <Image src="/brand/isotipo-mb.png" alt="" width={300} height={193} className="h-7 w-auto" />
            <span className="leading-tight">
              <span className="block text-sm font-extrabold tracking-tight">Materiales Belgrano</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">Panel</span>
            </span>
          </Link>
          <button ref={closeButtonRef} type="button" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" className={cn(DARK_ICON_BUTTON, "-mr-2 lg:hidden")}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
                      active ? "bg-brand text-brand-ink" : "text-white/75 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex flex-col leading-tight">
                      {item.label}
                      <span className={cn("text-[11px] font-medium", active ? "text-brand-ink/75" : "text-white/60")}>{item.description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-2 border-t border-white/10 p-3">
          <a href={webUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/75 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
            <ExternalLink className="h-5 w-5" aria-hidden="true" /> Ver la web
            <span className="sr-only">(se abre en otra pestaña)</span>
          </a>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-ink">
              {(user.name || user.email).slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-semibold">{user.name || user.email}</span>
              <span className="block truncate text-xs text-white/60">{user.role}</span>
            </span>
            <form action="/auth/signout" method="post">
              <button type="submit" aria-label="Cerrar sesión" title="Cerrar sesión" className={DARK_ICON_BUTTON}>
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div
        aria-hidden="true"
        className={cn("fixed inset-0 z-30 bg-ink/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden", mobileOpen ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={() => setMobileOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-[var(--w)]" style={{ "--w": `${SIDEBAR_WIDTH}px` } as React.CSSProperties}>
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-sidebar px-4 py-1.5 text-white lg:hidden">
          <Link href="/panel" className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg text-sm font-extrabold tracking-tight">
            <Image src="/brand/isotipo-mb.png" alt="" width={300} height={193} className="h-5 w-auto shrink-0" />
            <span className="truncate">{currentLabel}</span>
          </Link>
          <button
            ref={openButtonRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            aria-controls="panel-menu"
            className={cn(DARK_ICON_BUTTON, "-mr-1.5 border border-white/20 text-white")}
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main id="contenido" tabIndex={-1} className="mx-auto w-full focus:outline-none max-w-6xl flex-1 px-4 py-6 sm:px-7 sm:py-8">
          <div key={pathname} className="animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
