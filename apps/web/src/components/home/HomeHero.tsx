import { FaArrowRight, FaWhatsapp } from "react-icons/fa6";
import { LuChevronDown } from "react-icons/lu";
import { ROUTES, type HeroSlide } from "@mb/shared";
import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { HeroSlides } from "@/components/home/HeroSlides";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { whatsappGoHref } from "@/lib/whatsapp";

/**
 * Portada del inicio: foto (o carrusel) a pantalla completa, velo oscuro
 * y el título centrado, con una flecha que baja a la sección siguiente.
 * Ocupa la primera pantalla menos el header.
 */
export function HomeHero({ slides, title, text, nextSectionId }: { slides: HeroSlide[]; title: string; text?: string; nextSectionId?: string }) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] max-h-[1000px] items-center justify-center overflow-hidden bg-ink-dark text-white sm:min-h-[calc(100svh-5rem)]">
      <HeroSlides slides={slides} />

      {/* Velo: más oscuro abajo y al centro para que el texto siempre se lea. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink-dark/45" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(36,38,31,0.55)_0%,transparent_70%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-ink-dark/80 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-16 text-center sm:px-6">
        <div className="animate-fade-up">
          <Eyebrow light className="mb-4 sm:mb-5">
            Materiales Belgrano
          </Eyebrow>
          <h1 className="text-balance text-[2rem] font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.75rem]">{title}</h1>
          {text && <p className="mx-auto mt-4 max-w-xl text-pretty text-base font-light leading-relaxed text-white/85 sm:mt-5 sm:text-lg">{text}</p>}

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row">
            <TrackedLink
              href={whatsappGoHref("inicio")}
              event="whatsapp_click"
              params={{ source: "inicio" }}
              className="pressable inline-flex min-h-13 items-center gap-2.5 whitespace-nowrap rounded-full bg-brand-500 px-7 text-base font-semibold text-ink-dark !duration-500 hover:bg-white"
            >
              <FaWhatsapp className="h-5 w-5" aria-hidden />
              Consultar por WhatsApp
            </TrackedLink>

            <Link
              href={ROUTES.rubros}
              className="pressable group inline-flex min-h-13 items-center gap-2 rounded-full border border-white/60 px-7 text-base font-semibold text-white backdrop-blur-sm !duration-500 hover:border-white hover:bg-white hover:text-ink-dark"
            >
              Ver soluciones <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {nextSectionId && (
        <a
          href={`#${nextSectionId}`}
          aria-label="Bajar a la sección siguiente"
          className={`hero-scroll absolute ${slides.length > 1 ? "bottom-14" : "bottom-5"} left-1/2 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 text-white backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink-dark sm:bottom-7`}
        >
          <LuChevronDown className="h-5 w-5" aria-hidden />
        </a>
      )}
    </section>
  );
}
