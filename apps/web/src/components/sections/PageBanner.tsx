import type { HeroSlide } from "@mb/shared";
import { HeroSlides } from "@/components/home/HeroSlides";
import { Eyebrow } from "@/components/ui/SectionHeading";

/**
 * Portada tipo banner de las páginas interiores: mismas fotos editables que
 * el inicio (carrusel si hay más de una), a la mitad de alto.
 */
export function PageBanner({ slides, eyebrow, title, text }: { slides: HeroSlide[]; eyebrow?: string; title: string; text?: string }) {
  return (
    <section className="relative isolate flex min-h-[320px] items-center justify-center overflow-hidden bg-ink-dark text-white sm:min-h-[min(50svh,520px)]">
      <HeroSlides slides={slides} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink-dark/55" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink-dark/80 to-transparent" />
      <div className="animate-fade-up relative z-10 mx-auto max-w-3xl px-5 py-14 text-center sm:px-6">
        {eyebrow && (
          <Eyebrow light className="mb-3">
            {eyebrow}
          </Eyebrow>
        )}
        <h1 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">{title}</h1>
        {text && <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-white/80 sm:text-lg">{text}</p>}
      </div>
    </section>
  );
}
