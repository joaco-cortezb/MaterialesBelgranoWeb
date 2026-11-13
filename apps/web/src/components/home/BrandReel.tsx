"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FaPlay, FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const SRC = "/videos/materiales-belgrano-salon.mp4";
const POSTER = "/videos/materiales-belgrano-salon.jpg";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Video vertical de marca (el salón, el depósito y el equipo). Se reproduce
 * solo, sin sonido y en loop mientras se ve al menos la mitad; al salir de
 * pantalla se pausa. El archivo no se descarga hasta que el visitante llega a
 * la sección (`preload="none"`): antes sólo se ve la foto de portada.
 * Con "reducir movimiento" no arranca solo: queda la foto con un botón.
 */
export function BrandReel({ title }: { title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Si el navegador bloquea el autoplay queda la foto con el botón.
          video.play().then(() => setStarted(true)).catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  function play() {
    videoRef.current?.play().then(() => setStarted(true)).catch(() => {});
  }

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        src={SRC}
        poster={POSTER}
        muted={muted}
        loop
        playsInline
        preload="none"
        aria-label={title}
        className="h-full w-full object-cover"
      />
      {started ? (
        <button
          type="button"
          onClick={() => setMuted((value) => !value)}
          aria-label={muted ? "Activar el sonido del video" : "Silenciar el video"}
          aria-pressed={!muted}
          className="pressable absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-ink-dark/70 text-white backdrop-blur-sm hover:bg-ink-dark"
        >
          {muted ? <FaVolumeXmark className="h-4 w-4" aria-hidden /> : <FaVolumeHigh className="h-4 w-4" aria-hidden />}
        </button>
      ) : (
        <button type="button" onClick={play} aria-label={`Reproducir: ${title}`} className="absolute inset-0 flex items-center justify-center bg-ink-dark/25">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-ink-dark shadow-lg">
            <FaPlay className="ml-1 h-6 w-6" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}
