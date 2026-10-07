"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@mb/shared";

type NavLink = { href: string; label: string };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({
  links,
  orientation = "horizontal",
  onNavigate,
}: {
  links: readonly NavLink[];
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className={cn("flex", orientation === "horizontal" ? "items-center gap-2 xl:gap-4" : "flex-col gap-1")}>
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "pressable relative flex items-center rounded-lg font-semibold transition-colors",
                orientation === "horizontal"
                  ? "px-3 py-2 text-[17px] text-ink-soft hover:text-ink-dark"
                  : "min-h-12 px-4 text-lg text-ink hover:bg-surface-2",
                active && (orientation === "horizontal" ? "text-ink-dark" : "bg-brand-50 text-brand-800"),
              )}
            >
              {link.label}
              {orientation === "horizontal" && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-500 transition-transform duration-200 ease-[var(--ease-out-strong)]",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
