import type { ReactNode } from "react";
import { cn } from "@mb/shared";

/**
 * Lo que se ve cuando un slot todavía no tiene foto. En vez de un degradé
 * genérico, repite el motivo del isotipo (las tres losas en perspectiva) sobre
 * el gris oscuro de marca, con el ícono de la sección en verde.
 */
export function BrandPlaceholder({ icon, className }: { icon: ReactNode; className?: string }) {
  return (
    <div className={cn("brand-slabs absolute inset-0 flex items-center justify-center bg-ink-dark text-brand-400", className)}>
      <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-400/30 bg-ink-dark/80 backdrop-blur-sm [&>svg]:h-7 [&>svg]:w-7">
        {icon}
      </span>
    </div>
  );
}
