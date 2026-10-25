import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { ROUTES, SERVICIOS, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { buttonClassName } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { LogoMarquee } from "@/components/brands/LogoMarquee";
import { CategoriesCarousel } from "@/components/rubros/CategoriesCarousel";
import { ServicioIcon } from "@/components/servicios/ServicioIcon";
import { YouTubeAutoplay } from "@/components/home/YouTubeAutoplay";
import { WhatsappCta } from "@/components/sections/WhatsappCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { servicesSchema } from "@/lib/structured-data";
import { getBrands, getCategories, getHeroSlides, getHomeVideoId, getImageSlot } from "@/lib/cms";
import { HomeHero } from "@/components/home/HomeHero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [heroSlides, distribuidoraImage, categories, brands, videoId] = await Promise.all([
    getHeroSlides(),
    getImageSlot("home.distribuidora"),
    getCategories(),
    getBrands(),
    getHomeVideoId(),
  ]);

  return (
    <>
      <JsonLd schema={servicesSchema(SERVICIOS)} />
      <HomeHero slides={heroSlides} nextSectionId={videoId ? "conocenos" : undefined} />

      {/* Video */}
      {videoId && (
        <section id="conocenos" aria-labelledby="video-title" className="scroll-mt-16 py-16 sm:scroll-mt-20 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Conocenos"
              title="Así es Materiales Belgrano por dentro"
              text="Un salón de ventas moderno, un depósito ordenado y un equipo joven que sabe lo que vende."
              align="center"
            />
            <div className="relative mx-auto mt-8 aspect-video max-w-3xl overflow-hidden rounded-2xl border border-line bg-ink-dark shadow-xl sm:mt-10">
              <YouTubeAutoplay videoId={videoId} title={`Video institucional de ${SITE.name}`} />
            </div>
          </Container>
          <h2 id="video-title" className="sr-only">
            Video institucional
          </h2>
        </section>
      )}

      {/* Soluciones */}
      <section aria-labelledby="soluciones-title" className="overflow-hidden bg-surface py-16 sm:py-24">
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

      {/* Marcas */}
      <section aria-labelledby="marcas-title" className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Marcas"
            title="Trabajamos con los que saben."
            text="Fabricantes líderes del mercado eléctrico, con respaldo ante fallas y devoluciones. Tocá un logo para ver su catálogo."
            align="center"
          />
          <h2 id="marcas-title" className="sr-only">
            Marcas
          </h2>
        </Container>
        <LogoMarquee brands={brands} source="inicio" className="mt-10 sm:mt-12" />
        <Container>
          <div className="mt-8 text-center">
            <Link href={ROUTES.marcas} className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-700 hover:text-brand-800">
              Ver marcas por solución <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>

      {/* Servicios */}
      <section id="servicios" aria-labelledby="servicios-title" className="scroll-mt-20 bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Por qué elegirnos"
            title="Lo que hace la diferencia"
            text="Mismas marcas que todos; distinta forma de atenderte y de entregar."
            align="center"
          />
          <h2 id="servicios-title" className="sr-only">
            Servicios
          </h2>
          <ul className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {SERVICIOS.map((servicio) => (
              <li
                key={servicio.slug}
                id={servicio.slug}
                className="card-hover flex gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-col sm:gap-0 sm:p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-800 sm:h-12 sm:w-12">
                  <ServicioIcon icon={servicio.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div>
                  <h3 className="text-balance text-base font-bold leading-snug tracking-tight text-ink-dark sm:mt-5 sm:text-lg">{servicio.title}</h3>
                  <p className="mt-1 text-pretty text-sm leading-relaxed text-ink-soft sm:mt-2">{servicio.short}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Distribuidora 370 */}
      <section aria-labelledby="d370-title" className="pt-16 sm:pt-24">
        <Container>
          <div className="relative isolate overflow-hidden rounded-3xl bg-ink-dark text-white">
            {distribuidoraImage && (
              <Media
                src={distribuidoraImage.url}
                alt={distribuidoraImage.alt}
                position={distribuidoraImage.position}
                sizes="(min-width: 1280px) 1200px, 100vw"
                quality={65}
                className="absolute inset-0 -z-10 opacity-40"
              />
            )}
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-dark to-ink-dark/60" />
            <div className="flex flex-col gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <Eyebrow light className="mb-3">
                  Tienda online del grupo
                </Eyebrow>
                <h2 id="d370-title" className="text-balance text-3xl font-extrabold tracking-tight">
                  ¿Preferís comprar online? Entrá a {SITE.distribuidora370.name}.
                </h2>
                <p className="mt-3 text-white/75">
                  Una selección de productos con compra directa y envío a todo el país. Para listados de obra, seguí por WhatsApp.
                </p>
              </div>
              <TrackedLink
                href={SITE.distribuidora370.url}
                event="distribuidora_click"
                params={{ source: "inicio" }}
                external
                className={buttonClassName({ variant: "primary", size: "lg" })}
              >
                Ir a {SITE.distribuidora370.name} ↗
              </TrackedLink>
            </div>
          </div>
        </Container>
      </section>

      <WhatsappCta source="inicio" />
    </>
  );
}

