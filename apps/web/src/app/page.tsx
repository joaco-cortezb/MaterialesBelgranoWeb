import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa6";
import { ROUTES, RUBROS, SERVICIOS, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { ButtonLink, buttonClassName } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { BrandsGrid } from "@/components/brands/BrandsGrid";
import { RubroCard } from "@/components/rubros/RubroCard";
import { ServicioIcon } from "@/components/servicios/ServicioIcon";
import { YouTubeFacade } from "@/components/home/YouTubeFacade";
import { WhatsappCta } from "@/components/sections/WhatsappCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { servicesSchema } from "@/lib/structured-data";
import { getBrands, getHomeVideoId, getImageSlot, getImageSlots } from "@/lib/cms";
import { whatsappGoHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [hero, rubrosImage, distribuidoraImage, rubroImages, brands, videoId] = await Promise.all([
    getImageSlot("home.hero"),
    getImageSlot("home.rubros"),
    getImageSlot("home.distribuidora"),
    getImageSlots(RUBROS.map((rubro) => rubro.imageSlot)),
    getBrands(),
    getHomeVideoId(),
  ]);

  return (
    <>
      <JsonLd schema={servicesSchema(SERVICIOS)} />
      {/* Hero */}
      {/*
        El hero ocupa exactamente la primera pantalla (viewport menos el header)
        y centra el contenido: sin padding fijo, para que en una laptop de
        800 px de alto no queden las estadísticas cortadas.
      */}
      <section className="relative isolate flex min-h-[calc(100svh-4rem)] max-h-[960px] items-center overflow-hidden bg-ink-dark text-white sm:min-h-[calc(100svh-4.5rem)]">
        {hero && (
          <Media src={hero.url} alt={hero.alt} position={hero.position} priority sizes="100vw" quality={70} className="absolute inset-0 -z-10" />
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-dark via-ink-dark/85 to-ink-dark/40" />
        <Container className="py-10 sm:py-14">
          <div className="max-w-2xl animate-fade-up">
            <Eyebrow light className="mb-3 sm:mb-4">
              Electricidad + Iluminación · Mendoza
            </Eyebrow>
            <h1 className="text-balance text-[2.1rem] font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              Materiales eléctricos e iluminación en Mendoza.
            </h1>
            <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-white/80 sm:mt-5 sm:text-lg">
              Stock, precio y entrega en 24 hs para instaladores, empresas y hogares.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <TrackedLink
                href={whatsappGoHref("inicio")}
                event="whatsapp_click"
                params={{ source: "inicio" }}
                className={buttonClassName({ variant: "whatsapp", size: "lg" })}
              >
                <FaWhatsapp className="h-6 w-6" aria-hidden />
                Consultar por WhatsApp
              </TrackedLink>
              <ButtonLink href={ROUTES.rubros} variant="outline-light" size="lg">
                Ver soluciones
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Video */}
      {videoId && (
        <section aria-labelledby="video-title" className="py-16 sm:py-24">
          <Container className="grid items-center gap-10 lg:grid-cols-[2fr_3fr]">
            <SectionHeading
              eyebrow="Conocenos"
              title="Así es Materiales Belgrano por dentro"
              text="Un salón de ventas moderno, un depósito ordenado y un equipo joven que sabe lo que vende. Mirá el video y después pasá a conocernos."
            />
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-ink-dark shadow-xl">
              <YouTubeFacade videoId={videoId} title={`Video institucional de ${SITE.name}`} />
            </div>
          </Container>
          <h2 id="video-title" className="sr-only">
            Video institucional
          </h2>
        </section>
      )}

      {/* Rubros */}
      <section aria-labelledby="rubros-title" className="bg-surface py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Qué vendemos"
              title="Cinco soluciones, un solo proveedor para toda la obra"
              text="No somos un catálogo online: cada solución tiene su página con lo que trabajamos, las marcas y las preguntas que más nos hacen. Lo puntual lo resolvemos por WhatsApp."
            />
            <Link href={ROUTES.rubros} className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-700 hover:text-brand-800">
              Ver todas las soluciones <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <h2 id="rubros-title" className="sr-only">
            Soluciones
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RUBROS.map((rubro) => (
              <RubroCard key={rubro.slug} rubro={rubro} image={rubroImages[rubro.imageSlot]} />
            ))}
            {rubrosImage && (
              <div className="relative hidden overflow-hidden rounded-2xl border border-line lg:block">
                <Media src={rubrosImage.url} alt={rubrosImage.alt} position={rubrosImage.position} sizes="30vw" className="absolute inset-0" />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Servicios */}
      <section id="servicios" aria-labelledby="servicios-title" className="scroll-mt-20 py-16 sm:py-24">
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
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((servicio) => (
              <li key={servicio.slug} id={servicio.slug} className="card-hover flex flex-col rounded-2xl border border-line bg-surface p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
                  <ServicioIcon icon={servicio.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-ink-dark">{servicio.title}</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-soft">{servicio.short}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Marcas */}
      <section aria-labelledby="marcas-title" className="bg-surface py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Marcas"
              title="Las marcas que trabajamos"
              text="Trabajamos con los fabricantes líderes del mercado eléctrico argentino. Entrá al catálogo de cada uno y consultanos por WhatsApp lo que necesitás."
            />
            <Link href={ROUTES.marcas} className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-700 hover:text-brand-800">
              Ver todas las marcas <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <h2 id="marcas-title" className="sr-only">
            Marcas
          </h2>
          <div className="mt-10">
            <BrandsGrid brands={brands.slice(0, 8)} source="inicio" />
          </div>
        </Container>
      </section>

      {/* Distribuidora 370 */}
      <section aria-labelledby="d370-title" className="py-16 sm:py-24">
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

