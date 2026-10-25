import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { ROUTES, SERVICIOS, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
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
        <section id="conocenos" aria-labelledby="video-title" className="scroll-mt-16 bg-ink-dark py-14 text-white sm:scroll-mt-20 sm:py-20">
          <Container>
            <div className="text-center">
              <Eyebrow light>Conocenos</Eyebrow>
              <h2 id="video-title" className="mt-2 text-lg font-semibold text-white/85 sm:text-xl">
                Así es {SITE.name} por dentro
              </h2>
            </div>
            <div className="relative mx-auto mt-7 aspect-video max-w-5xl overflow-hidden rounded-2xl bg-black shadow-[0_30px_80px_-30px_rgba(124,185,40,0.45)] ring-1 ring-white/10 sm:mt-9">
              <YouTubeAutoplay videoId={videoId} title={`Video institucional de ${SITE.name}`} />
            </div>
          </Container>
        </section>
      )}

      {/* Soluciones */}
      <section id="soluciones" aria-labelledby="soluciones-title" className="scroll-mt-16 overflow-hidden bg-surface py-16 sm:scroll-mt-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Soluciones"
            title="Todo lo que lleva una instalación."
            text="Cinco líneas con stock permanente y gente que sabe lo que vende. Elegí la tuya y mirá con qué trabajamos."
            align="center"
          />
          <h2 id="soluciones-title" className="sr-only">
            Soluciones
          </h2>
          <div className="mt-10 sm:mt-12">
            <CategoriesCarousel categories={categories} />
          </div>
        </Container>
      </section>

      {bannerSoluciones && <HomeBanner banner={bannerSoluciones} />}

      {/* Marcas: franja verde de marca. */}
      <section aria-labelledby="marcas-title" className="bg-brand-500 py-16 text-ink-dark sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-condensed text-sm font-semibold uppercase tracking-[0.18em] text-ink-dark/70">Marcas</p>
            <h2 id="marcas-title" className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              Trabajamos con los que saben.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-ink-dark/75 sm:text-lg">
              Fabricantes líderes del mercado eléctrico, con respaldo ante fallas y devoluciones. Tocá un logo para ver su catálogo.
            </p>
          </div>
        </Container>
        <LogoMarquee brands={brands} source="inicio" className="mt-10 sm:mt-12" />
        <Container>
          <div className="mt-10 text-center">
            <Link
              href={ROUTES.marcas}
              className="pressable group inline-flex min-h-12 items-center gap-2 rounded-full bg-ink-dark px-7 font-semibold text-white hover:bg-white hover:text-ink-dark"
            >
              Ver catálogos <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>

      {/* Por qué elegirnos */}
      <section id="servicios" aria-labelledby="servicios-title" className="scroll-mt-20 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Por qué elegirnos</Eyebrow>
            <h2 id="servicios-title" className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-ink-dark sm:text-5xl">
              Mismas marcas que todos. <span className="text-brand-600">Otra forma de atenderte.</span>
            </h2>
          </div>
          <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:mt-16 lg:grid-cols-3 lg:gap-x-12">
            {SERVICIOS.map((servicio) => (
              <li key={servicio.slug} id={servicio.slug} className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-ink-dark shadow-[0_12px_28px_-12px_rgba(124,185,40,0.9)] sm:h-20 sm:w-20">
                  <ServicioIcon icon={servicio.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
                </span>
                <h3 className="mt-4 text-balance text-base font-bold leading-snug tracking-tight text-ink-dark sm:mt-5 sm:text-lg">{servicio.title}</h3>
                <p className="mt-1.5 hidden max-w-xs text-pretty text-sm leading-relaxed text-ink-soft sm:block">{servicio.short}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {bannerFinal && <HomeBanner banner={bannerFinal} className="pt-0 sm:pt-0" />}
    </>
  );
}
