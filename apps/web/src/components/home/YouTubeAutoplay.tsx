"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FaPlay } from "react-icons/fa6";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Video de YouTube que arranca solo y sin sonido (los navegadores sólo
 * permiten autoplay silenciado), en loop. El iframe se crea recién cuando se
 * ve el 30 % del video: así arranca cuando llegás a la sección y el player
 * (~500 KB) no compite con la carga de la portada. Antes, la miniatura.
 * Con "reducir movimiento" no arranca solo: la miniatura lleva un botón de
 * reproducir y el iframe se crea al tocarlo.
 */
export function YouTubeAutoplay({ videoId, title }: { videoId: string; title: string }) {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const autoplay = !playing;
  const params = new URLSearchParams({
    autoplay: "1",
    // Al tocar "reproducir" va con sonido y sin loop; solo, silenciado y en loop.
    ...(autoplay ? { mute: "1", loop: "1", playlist: videoId } : {}),
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });
  const showIframe = playing || (ready && !reducedMotion);

  return (
    <div ref={boxRef} className="absolute inset-0">
      {/* Miniatura de 480 px: no pasa por el optimizador (no hay anchos más grandes que pedir). */}
      <Image src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" fill unoptimized className="object-cover" />
      {showIframe ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        reducedMotion && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Reproducir: ${title}`}
            className="absolute inset-0 flex items-center justify-center bg-ink-dark/30"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-ink-dark shadow-lg">
              <FaPlay className="ml-1 h-6 w-6" aria-hidden />
            </span>
          </button>
        )
      )}
    </div>
  );
}
