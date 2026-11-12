import type { HTMLAttributes } from "react";
import { cn } from "@mb/shared";

/**
 * Ancho del contenido. `text` es la columna de lectura (textos largos, 404):
 * va como variante y no como `className` porque `cn` no resuelve conflictos
 * entre clases y un `max-w-3xl` suelto pierde contra el `max-w-7xl` de base.
 */
const WIDTHS = {
  wide: "max-w-7xl",
  text: "max-w-3xl",
} as const;

export function Container({
  children,
  className,
  width = "wide",
  ...props
}: HTMLAttributes<HTMLDivElement> & { width?: keyof typeof WIDTHS }) {
  return (
    <div {...props} className={cn("mx-auto w-full px-4 sm:px-8 lg:px-10", WIDTHS[width], className)}>
      {children}
    </div>
  );
}
