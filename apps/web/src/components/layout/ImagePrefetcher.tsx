"use client";

import { useEffect } from "react";
import { getImageProps } from "next/image";

export type PrefetchImage = {
  src: string;
  sizes: string;
  quality: number;
  /** Sólo se baja si la pantalla cumple esta media query (banners de celular / computadora). */
  media?: string;
};

/**
 * Con la página ya cargada y el navegador libre, baja en segundo plano las
 * imágenes principales de las otras secciones (portadas, banners, fotos),
 * con el mismo ancho que va a elegir cada página. Al navegar ya están en la
 * cache del navegador y se ven al instante. No se activa con "ahorro de datos".
 */
export function ImagePrefetcher({ images }: { images: PrefetchImage[] }) {
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection?.saveData || connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g") return;

    let cancelled = false;
    const loaded: HTMLImageElement[] = [];
    const run = () => {
      if (cancelled) return;
      for (const image of images) {
        if (image.media && !window.matchMedia(image.media).matches) continue;
        const { props } = getImageProps({ src: image.src, alt: "", fill: true, sizes: image.sizes, quality: image.quality });
        const element = new window.Image();
        element.decoding = "async";
        element.fetchPriority = "low";
        // Sólo `sizes` + `srcset`: el navegador elige el ancho igual que en la
        // página. Asignar también `src` disparaba una segunda descarga del más grande.
        if (props.sizes) element.sizes = props.sizes;
        if (props.srcSet) element.srcset = props.srcSet;
        else element.src = props.src;
        loaded.push(element);
      }
    };
    const schedule = () => {
      const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1200));
      idle(run);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
    };
  }, [images]);

  return null;
}
