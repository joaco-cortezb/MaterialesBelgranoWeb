"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Video de YouTube que arranca solo y sin sonido (los navegadores sólo
 * permiten autoplay silenciado), en loop. El iframe se crea recién cuando la
 * página terminó de cargar: así el player (~500 KB) no compite con la foto
 * de la portada. Mientras tanto se ve la miniatura.
 */
export function YouTubeAutoplay({ videoId, title }: { videoId: string; title: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onLoad = () => setReady(true);
    if (document.readyState === "complete") {
      const timer = window.setTimeout(onLoad, 0);
      return () => window.clearTimeout(timer);
    }
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
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
    <>
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 768px) 768px, 100vw"
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
    </>
  );
}
