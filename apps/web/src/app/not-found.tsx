import type { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa6";
import { ROUTES } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { ButtonLink, buttonClassName } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { whatsappGoHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-2xl text-center">
        <Eyebrow className="mb-3">Error 404</Eyebrow>
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-ink-dark sm:text-5xl">Esta página no existe o se movió.</h1>
        <p className="mt-4 text-pretty text-lg text-ink-soft">
          Si llegaste buscando un producto, escribinos por WhatsApp y te decimos si lo tenemos.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={ROUTES.home} variant="dark" size="lg">
            Volver al inicio
          </ButtonLink>
          <TrackedLink href={whatsappGoHref("404")} event="whatsapp_click" params={{ source: "404" }} className={buttonClassName({ variant: "whatsapp", size: "lg" })}>
            <FaWhatsapp className="h-5 w-5" aria-hidden />
            Consultar por WhatsApp
          </TrackedLink>
        </div>
      </Container>
    </section>
  );
}
