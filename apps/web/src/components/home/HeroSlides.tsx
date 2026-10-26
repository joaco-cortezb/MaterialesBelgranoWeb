"use client";

import { useEffect, useState } from "react";
import type { HeroSlide } from "@mb/shared";
import { cn } from "@mb/shared";
import { Media } from "@/components/ui/Media";

const INTERVAL_MS = 6500;

/**
 * Fondo de la portada: las fotos cargadas en el panel, apiladas, con fundido
 * cruzado. Con una sola foto no hay carrusel ni puntos. Se pausa con la
 * pestaña oculta y respeta "reducir movimiento" (no avanza solo).
 */
export function HeroSlides({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Las fotos 2 en adelante se piden recién con la página cargada: así no
  // compiten con la primera, que es la imagen más importante de la carga.
  const [restReady, setRestReady] = useState(false);
  const many = slides.length > 1;

  useEffect(() => {
    if (!many) return;
    const ready = () => setRestReady(true);
    if (document.readyState === "complete") {
      const timer = window.setTimeout(ready, 0);
      return () => window.clearTimeout(timer);
    }
    window.addEventListener("load", ready, { once: true });
    return () => window.removeEventListener("load", ready);
  }, [many]);

  useEffect(() => {
    if (!many || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Un timeout por foto: al tocar un punto, el conteo arranca de cero
    // junto con la barra de progreso.
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [active, many, paused, slides.length]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.visibilityState !== "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <>
      <div className="absolute inset-0 -z-20">
        {slides.map((slide, index) => (index === 0 || restReady || index === active) && (
          <div
            key={slide.id}
            aria-hidden={index !== active}
            className={cn(
              "hero-slide absolute inset-0 transition-opacity duration-[1400ms] ease-in-out",
              index === active ? "opacity-100" : "opacity-0",
            )}
            data-active={index === active}
          >
            <Media
              src={slide.url}
              alt={slide.alt}
              position={slide.position}
              priority={index === 0}
              sizes="100vw"
              quality={75}
              className="absolute inset-0"
            />
          </div>
        ))}
      </div>

      {many && (
        <div
          className="absolute bottom-5 right-4 z-20 flex gap-1 sm:bottom-7 sm:right-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1} de ${slides.length}`}
              aria-current={index === active}
              className="group flex h-11 items-center px-2.5"
            >
              <span
                className={cn(
                  "relative block h-1 overflow-hidden rounded-full bg-white/35 transition-[width] duration-500 ease-[var(--ease-out-strong)]",
                  index === active ? "w-10" : "w-5 group-hover:bg-white/60",
                )}
              >
                {index === active && !paused && (
                  <span
                    key={active}
                    className="hero-progress absolute inset-y-0 left-0 bg-brand-400"
                    style={{ animationDuration: `${INTERVAL_MS}ms` }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
