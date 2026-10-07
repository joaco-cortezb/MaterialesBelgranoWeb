import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@mb/shared";

type Variant = "primary" | "dark" | "outline" | "outline-light" | "whatsapp";
type Size = "md" | "lg" | "compact";

/**
 * Verde de marca con texto oscuro a propósito: blanco sobre #7CB928 no llega
 * al contraste AA. El botón de WhatsApp sigue la misma regla.
 */
const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-500 text-ink-dark hover:bg-brand-400",
  dark: "bg-ink-dark text-white hover:bg-ink",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-surface",
  "outline-light": "border border-white/50 text-white hover:bg-white/10",
  // En hover se levanta apenas y proyecta un halo verde; el ícono gira (`group`).
  whatsapp:
    "group bg-whatsapp text-ink-dark shadow-[0_0_0_0_rgba(37,211,102,0)] hover:-translate-y-0.5 hover:bg-[#30dd7a] hover:shadow-[0_10px_28px_-8px_rgba(37,211,102,0.85)] active:translate-y-0 [&>svg]:transition-transform [&>svg]:duration-300 [&>svg]:ease-[var(--ease-out-strong)] hover:[&>svg]:scale-110 hover:[&>svg]:-rotate-12",
};

const SIZES: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
  compact: "min-h-11 px-4 py-2.5 text-sm sm:px-5",
};

const BASE =
  "pressable inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight select-none";

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(BASE, SIZES[size], VARIANTS[variant], className);
}

export function ButtonLink({
  href,
  children,
  variant,
  size,
  className,
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
}) {
  const classes = buttonClassName({ variant, size, className });
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
