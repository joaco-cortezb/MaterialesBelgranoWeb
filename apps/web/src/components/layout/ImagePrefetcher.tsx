"use client";

import { useEffect } from "react";
import { getImageProps } from "next/image";

export type PrefetchImage = {
  /** Página donde se ve: en esa misma página no se precarga. */
  path: string;
  src: string;
  sizes: string;
  quality: number;
  /** Sólo se baja si la pantalla cumple esta media query (versión de celular / computadora). */
  media?: string;
};

/**
 * Con la página ya cargada y el navegador libre, baja en segundo plano la
 * primera foto de portada de las otras páginas, con el mismo ancho que va a
 * elegir cada una. Al navegar ya está en la cache del navegador y se ve al
 * instante. Sólo con conexión 4g (si el navegador la informa) y sin "ahorro
 * de datos"; al desmontar corta lo que siga bajando.
 */
export function ImagePrefetcher({ images }: { images: PrefetchImage[] }) {
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection && (connection.saveData || connection.effectiveType !== "4g")) return;

    let cancelled = false;
    let idleId: number | undefined;
    const loaded: HTMLImageElement[] = [];
    const run = () => {
      if (cancelled) return;
      const current = window.location.pathname;
      for (const image of images) {
        if (image.path === current) continue;
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
      idleId = window.requestIdleCallback ? window.requestIdleCallback(run) : window.setTimeout(run, 1200);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) {
        if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
        else window.clearTimeout(idleId);
      }
      // Vaciar `srcset`/`src` cancela las descargas que sigan en curso.
      for (const element of loaded) {
        element.removeAttribute("srcset");
        element.removeAttribute("src");
      }
    };
  }, [images]);

  return null;
}
