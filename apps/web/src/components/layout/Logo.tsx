import Image from "next/image";
import Link from "next/link";
import { ROUTES, SITE, cn } from "@mb/shared";

/**
 * Logo principal del manual de marca (isotipo MB + "materiales belgrano"), en
 * `public/brand/`. Al pasar el mouse crece apenas y se enciende un halo verde
 * detrás; en touch no hay hover, así que no pasa nada.
 */
export function Logo({
  className,
  variant = "dark",
  size = "md",
  priority = false,
}: {
  className?: string;
  /** `dark`: texto negro para fondos claros. `light`: texto claro para fondos oscuros. */
  variant?: "dark" | "light";
  size?: "md" | "lg";
  priority?: boolean;
}) {
  const src = variant === "light" ? "/brand/logo-mb-claro.png" : "/brand/logo-mb.png";
  return (
    <Link href={ROUTES.home} aria-label={`${SITE.name}: ir al inicio`} className={cn("group relative inline-flex shrink-0 items-center", className)}>
      <span
        aria-hidden
        className="absolute inset-[-20%] -z-10 rounded-full bg-brand-400/45 opacity-0 blur-2xl transition-[opacity,transform] duration-300 ease-[var(--ease-out-strong)] scale-75 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none"
      />
      <Image
        src={src}
        alt={SITE.name}
        width={1200}
        height={318}
        sizes={size === "lg" ? "260px" : "170px"}
        preload={priority}
        className={cn(
          "w-auto transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          size === "lg" ? "h-14 sm:h-16" : "h-8 sm:h-10",
        )}
      />
    </Link>
  );
}
