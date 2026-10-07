import Image from "next/image";
import { cn } from "@mb/shared";

/**
 * Imagen optimizada que llena su contenedor (`object-cover`). El contenedor
 * define el tamaño; `sizes` evita servir fotos al doble del ancho real.
 */
export function Media({
  src,
  alt,
  className,
  sizes = "100vw",
  position = "50% 50%",
  priority = false,
  quality,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  position?: string;
  priority?: boolean;
  quality?: number;
}) {
  // Si quien llama ya posiciona el contenedor (`absolute inset-0`), no se
  // agrega `relative`: las dos clases juntas dejan la caja sin alto.
  const positionClass = className?.includes("absolute") ? "" : "relative";

  return (
    <div className={cn(positionClass, "overflow-hidden bg-surface-2", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={priority}
        fetchPriority={priority ? "high" : undefined}
        quality={quality}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
