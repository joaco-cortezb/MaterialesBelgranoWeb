import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { ROUTES, SERVICIOS, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { LogoMarquee } from "@/components/brands/LogoMarquee";
import { CategoriesCarousel } from "@/components/rubros/CategoriesCarousel";
import { ServicioIcon } from "@/components/servicios/ServicioIcon";
import { YouTubeAutoplay } from "@/components/home/YouTubeAutoplay";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeBanner } from "@/components/sections/HomeBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { servicesSchema } from "@/lib/structured-data";
import { getBanner, getBrands, getCategories, getHeroSlides, getHomeHeroText, getHomeVideoId } from "@/lib/cms";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [heroSlides, heroText, categories, brands, videoId, bannerSoluciones, bannerFinal] = await Promise.all([
    getHeroSlides("inicio"),
    getHomeHeroText(),
    getCategories(),
    getBrands(),
    getHomeVideoId(),
    getBanner("inicio.soluciones"),
    getBanner("inicio.final"),
  ]);

  return (
    <>
      <JsonLd schema={servicesSchema(SERVICIOS)} />
      <HomeHero slides={heroSlides} title={heroText.title} text={heroText.text} nextSectionId={videoId ? "conocenos" : "soluciones"} />

      {/* Video: fondo oscuro para que el video sea lo que resalta. */}
      {videoId && (
        <section id="conocenos" aria-labelledby="video-title" className="bg-ink-dark py-14 text-white sm:py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-condensed text-base font-semibold uppercase tracking-[0.2em] text-brand-300 sm:text-lg">Por dentro</p>
              <h2 id="video-title" className="mt-2 text-balance text-2xl font-extrabold tracking-tight sm:text-4xl">
                Un salón pensado para que elegir sea fácil
              </h2>
            </div>
            <div className="relative mx-auto mt-8 aspect-video max-w-5xl overflow-hidden rounded-2xl bg-black shadow-[0_30px_80px_-30px_rgba(124,185,40,0.45)] ring-1 ring-white/10 sm:mt-10">
              <YouTubeAutoplay videoId={videoId} title={`Video institucional de ${SITE.name}`} />
            </div>
          </Container>
        </section>
      )}

      {/* Soluciones: título, controles y carrusel entran en una pantalla. */}
      <section
        id="soluciones"
        aria-labelledby="soluciones-title"
        className="flex flex-col justify-center overflow-hidden bg-surface py-10 sm:min-h-[calc(100svh-5rem)] sm:py-8"
      >
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="soluciones-title" className="text-balance text-4xl font-extrabold tracking-tight text-ink-dark sm:text-5xl">
              Soluciones
            </h2>
            <p className="mt-3 text-pretty text-base text-ink-soft sm:text-lg">Todo lo que lleva una instalación, con stock permanente y gente que sabe lo que vende.</p>
          </div>
          <div className="mt-5">
            <CategoriesCarousel categories={categories} />
          </div>
        </Container>
      </section>

      {bannerSoluciones && <HomeBanner banner={bannerSoluciones} className="bg-surface" />}

      {/* Marcas: degradé de negro a verde de marca. */}
      <section aria-labelledby="marcas-title" className="bg-gradient-to-br from-ink-dark via-[#2c3a19] to-brand-700 py-16 text-white sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-condensed text-base font-semibold uppercase tracking-[0.2em] text-brand-300 sm:text-lg">Marcas</p>
            <h2 id="marcas-title" className="mt-2 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
              Trabajamos con los que saben.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
              Fabricantes líderes del mercado eléctrico, con respaldo ante fallas y devoluciones. Tocá un logo para ver su catálogo.
            </p>
          </div>
        </Container>
        <LogoMarquee brands={brands} source="inicio" className="mt-10 sm:mt-14" />
        <Container>
          <div className="mt-10 text-center sm:mt-12">
            <Link
              href={ROUTES.marcas}
              className="pressable group inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-500 px-7 font-semibold text-ink-dark hover:bg-white"
            >
              Ver catálogos <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>

      {/* Por qué elegirnos: seis cards iguales, compactas, en una pantalla. */}
      <section id="servicios" aria-labelledby="servicios-title" className="py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-condensed text-base font-semibold uppercase tracking-[0.2em] text-brand-700 sm:text-lg">Por qué elegirnos</p>
            <h2 id="servicios-title" className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-ink-dark sm:text-4xl">
              Mismas marcas que todos. <span className="text-brand-600">Otra forma de atenderte.</span>
            </h2>
          </div>
          {/* Un solo panel dividido con líneas finas: cada celda centrada, con un dato grande arriba. */}
          <ul className="mx-auto mt-8 grid max-w-6xl gap-px overflow-hidden rounded-3xl border border-line bg-line sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((servicio) => (
              <li
                key={servicio.slug}
                id={servicio.slug}
                className="group relative flex flex-col items-center overflow-hidden bg-surface px-6 py-7 text-center transition-colors duration-300 hover:bg-brand-50 sm:px-8 sm:py-10"
              >
                <ServicioIcon
                  icon={servicio.icon}
                  className="pointer-events-none absolute -right-3 -top-3 h-20 w-20 text-brand-500/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                />
                <p className="whitespace-nowrap font-condensed text-4xl font-bold uppercase leading-none tracking-tight text-brand-600 sm:text-[2.6rem] xl:text-5xl">{servicio.stat}</p>
                <span aria-hidden className="mt-4 h-0.5 w-8 rounded-full bg-brand-500 transition-[width] duration-300 group-hover:w-14" />
                <h3 className="mt-4 text-base font-bold tracking-tight text-ink-dark sm:text-lg">
                  <span className="sr-only">{servicio.title}: </span>
                  <span aria-hidden>{servicio.label}</span>
                </h3>
                <p className="mt-2 max-w-[30ch] text-pretty text-sm leading-relaxed text-ink-soft sm:text-[15px]">{servicio.short}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {bannerFinal && <HomeBanner banner={bannerFinal} className="pt-0 sm:pt-0" />}
    </>
  );
}
