"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Video de YouTube que arranca solo y sin sonido (los navegadores sólo
 * permiten autoplay silenciado), en loop. El iframe se crea recién cuando se
 * ve el 30 % del video: así arranca cuando llegás a la sección y el player
 * (~500 KB) no compite con la carga de la portada. Antes, la miniatura.
 */
export function YouTubeAutoplay({ videoId, title }: { videoId: string; title: string }) {
  const [ready, setReady] = useState(false);

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

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });

  return (
    <div ref={boxRef} className="absolute inset-0">
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 1024px) 1024px, 100vw"
        className="object-cover"
      />
      {ready && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}
