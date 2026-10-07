"use client";

import Image from "next/image";
import { useState } from "react";
import { FaPlay } from "react-icons/fa6";

/**
 * Facade de YouTube: miniatura + botón; el iframe recién se crea al hacer
 * clic. Evita cargar ~500 KB de player en cada visita al inicio.
 */
export function YouTubeFacade({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Reproducir video: ${title}`}
      className="pressable group absolute inset-0 h-full w-full"
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover"
      />
      <span className="absolute inset-0 bg-ink-dark/20 transition-colors duration-200 group-hover:bg-ink-dark/30" />
      <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-500 text-ink-dark shadow-xl transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:scale-105">
        <FaPlay className="ml-1 h-7 w-7" aria-hidden />
      </span>
    </button>
  );
}
