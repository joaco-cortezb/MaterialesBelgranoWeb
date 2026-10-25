import { FaArrowRight, FaWhatsapp } from "react-icons/fa6";
import { LuArrowUpRight } from "react-icons/lu";
import { ROUTES, type HeroSlide } from "@mb/shared";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { HeroSlides } from "@/components/home/HeroSlides";
import { whatsappGoHref } from "@/lib/whatsapp";

/**
 * Portada del inicio: foto (o carrusel) a pantalla completa, velo oscuro,
 * líneas verticales finas que ordenan la composición y el título centrado.
 * Ocupa la primera pantalla menos el header.
 */
export function HomeHero({ slides }: { slides: HeroSlide[] }) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] max-h-[1000px] items-center justify-center overflow-hidden bg-ink-dark text-white sm:min-h-[calc(100svh-5rem)]">
      <HeroSlides slides={slides} />

      {/* Velo: más oscuro abajo y al centro para que el texto siempre se lea. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink-dark/45" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(36,38,31,0.55)_0%,transparent_70%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-ink-dark/80 to-transparent" />

      {/* Líneas de grilla (1 · 3 · 4 · 3 · 1 de 12 columnas). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden grid-cols-12 divide-x divide-white/15 md:grid">
        <div className="col-span-1" />
        <div className="col-span-3" />
        <div className="col-span-4" />
        <div className="col-span-3" />
        <div className="col-span-1" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-16 text-center sm:px-6">
        <div className="animate-fade-up">
          <Eyebrow light className="mb-4 sm:mb-5">
            Electricidad + Iluminación · Mendoza
          </Eyebrow>
          <h1 className="text-balance text-[2.4rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[5.25rem]">
            Materiales eléctricos e iluminación en Mendoza
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base font-light leading-relaxed text-white/85 sm:mt-6 sm:text-xl">
            Stock, precio y entrega en 24 hs para instaladores, empresas y hogares.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row">
            <TrackedLink
              href={whatsappGoHref("inicio")}
              event="whatsapp_click"
              params={{ source: "inicio" }}
              className="hero-cta pressable group inline-flex items-center rounded-full"
            >
              <span className="inline-flex min-h-14 items-center gap-2.5 whitespace-nowrap rounded-full bg-brand-500 px-5 text-[15px] font-semibold sm:px-6 sm:text-base text-ink-dark transition-colors duration-500 group-hover:bg-white">
                <FaWhatsapp className="h-5 w-5" aria-hidden />
                Consultar por WhatsApp
              </span>
              <span
                aria-hidden
                className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-brand-500 text-ink-dark transition-colors duration-500 group-hover:bg-white"
              >
                <LuArrowUpRight className="hero-arrow hero-arrow-out absolute h-5 w-5" />
                <LuArrowUpRight className="hero-arrow hero-arrow-in absolute h-5 w-5" />
              </span>
            </TrackedLink>

            <Link
              href={ROUTES.rubros}
              className="pressable inline-flex min-h-14 items-center gap-2 rounded-full border border-white/50 px-7 text-base font-semibold tracking-tight text-white backdrop-blur-sm hover:border-white hover:bg-white/10"
            >
              Ver soluciones <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
