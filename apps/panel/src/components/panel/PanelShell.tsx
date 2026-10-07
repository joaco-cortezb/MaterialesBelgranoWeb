"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

export function PanelShell({ user, role, webUrl, children }: { user: User; role: Role; webUrl: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMobileOpen(false));
  }, [pathname]);

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

  return (
    <div className="min-h-screen">
      <aside
        aria-label="Navegación del panel"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[min(100%,320px)] flex-col bg-sidebar text-white transition-transform duration-200 ease-[var(--ease-out-strong)] motion-reduce:transition-none lg:w-[var(--w)] lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ "--w": `${SIDEBAR_WIDTH}px` } as React.CSSProperties}
      >
        <div className="flex h-[72px] items-center justify-between px-5">
          <Link href="/panel" className="flex items-center gap-3" aria-label="Ir al inicio del panel">
            <Image src="/brand/isotipo.png" alt="" width={36} height={36} className="h-9 w-9" />
            <span className="leading-tight">
              <span className="block text-sm font-extrabold tracking-tight">Materiales Belgrano</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">Panel</span>
            </span>
          </Link>
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden">
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
                      "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
                      active ? "bg-brand text-brand-ink" : "text-white/75 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex flex-col leading-tight">
                      {item.label}
                      <span className={cn("text-[11px] font-medium", active ? "text-brand-ink/70" : "text-white/45")}>{item.description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-2 border-t border-white/10 p-3">
          <a href={webUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white">
            <ExternalLink className="h-5 w-5" /> Ver la web
          </a>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-ink">
              {(user.name || user.email).slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-semibold">{user.name || user.email}</span>
              <span className="block truncate text-xs text-white/50">{user.role}</span>
            </span>
            <form action="/auth/signout" method="post">
              <button type="submit" aria-label="Cerrar sesión" title="Cerrar sesión" className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white">
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
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-sidebar px-4 py-2.5 text-white lg:hidden">
          <Link href="/panel" className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
            <Image src="/brand/isotipo.png" alt="" width={28} height={28} className="h-7 w-7" />
            Panel
          </Link>
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Abrir menú" className="rounded-lg border border-white/20 p-2 hover:bg-white/10">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-7 sm:py-8">
          <div key={pathname} className="animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
