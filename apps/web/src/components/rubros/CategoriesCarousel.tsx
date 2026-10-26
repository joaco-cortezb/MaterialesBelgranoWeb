"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { ROUTES, cn, type Category } from "@mb/shared";
import { Media } from "@/components/ui/Media";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";
import { RubroIcon } from "@/components/rubros/RubroIcon";

/**
 * Carrusel circular de soluciones: al llegar al final sigue con las del
 * principio (`loop`). Avanza solo cada pocos segundos, se pausa con el mouse
 * encima o al interactuar, y la card del centro queda en primer plano.
 * Con `prefers-reduced-motion` no hay autoplay. Las cards toman el alto que
 * queda en la pantalla para que la sección entera (título, controles y
 * carrusel) se vea sin scrollear.
 */
export function CategoriesCarousel({ categories }: { categories: Category[] }) {
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, duration: 32 },
    reducedMotion ? [] : [Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (categories.length === 0) return null;

  return (
    <div className="relative" aria-roledescription="carrusel" aria-label="Soluciones">
      {/* Controles arriba y al centro: siempre a la vista junto con las cards. */}
      <div className="flex items-center justify-center gap-5">
        <ArrowButton label="Anterior" onClick={() => emblaApi?.scrollPrev()}>
          <FaArrowLeft className="h-4 w-4" aria-hidden />
        </ArrowButton>
        <div className="flex items-center gap-2">
          {categories.map((category, index) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Ir a ${category.name}`}
              aria-current={index === selected}
              className="group flex h-11 items-center px-0.5"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out-strong)]",
                  index === selected ? "w-7 bg-brand-600" : "w-1.5 bg-ink/20 group-hover:bg-ink/40",
                )}
              />
            </button>
          ))}
        </div>
        <ArrowButton label="Siguiente" onClick={() => emblaApi?.scrollNext()}>
          <FaArrowRight className="h-4 w-4" aria-hidden />
        </ArrowButton>
      </div>
      <div ref={emblaRef} className="-mb-10 mt-2 overflow-hidden pb-14 pt-4">
        <div className="-ml-4 flex touch-pan-y sm:-ml-6">
          {categories.map((category, index) => (
            <div
              key={category.slug}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${categories.length}: ${category.name}`}
              className="min-w-0 shrink-0 grow-0 basis-[82%] pl-4 sm:basis-1/2 sm:pl-6 lg:basis-1/3"
            >
              <Slide category={category} active={index === selected} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function Slide({ category, active }: { category: Category; active: boolean }) {
  return (
    <Link
      href={ROUTES.rubro(category.slug)}
      className={cn(
        "group relative block h-[clamp(300px,calc(100svh-25rem),560px)] overflow-hidden rounded-3xl bg-ink-dark text-white shadow-[0_18px_36px_-22px_rgba(36,38,31,0.5)]",
        "transition-[transform,opacity] duration-500 ease-[var(--ease-out-strong)] motion-reduce:transition-none",
        active ? "scale-100 opacity-100" : "scale-[0.94] opacity-70",
      )}
    >
      {category.image ? (
        <Media
          src={category.image}
          alt={category.imageAlt}
          position={category.imagePosition}
          sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 82vw"
          className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.04]"
        />
      ) : (
        <BrandPlaceholder icon={<RubroIcon slug={category.slug} />} className="items-start pt-[14%] sm:pt-[22%]" />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-dark via-ink-dark/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-7 text-center sm:px-8 sm:pb-9">
        <h3 className="text-balance text-2xl font-extrabold tracking-tight sm:text-[1.7rem]">{category.name}</h3>
        <p className="mt-2 max-w-xs text-pretty text-sm leading-relaxed text-white/75 sm:text-[15px]">{category.summary}</p>
        <span className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-semibold backdrop-blur-sm transition-colors duration-200 group-hover:bg-brand-500 group-hover:text-ink-dark">
          Ver solución
          <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="pressable flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink hover:border-ink hover:bg-ink-dark hover:text-white"
    >
      {children}
    </button>
  );
}
