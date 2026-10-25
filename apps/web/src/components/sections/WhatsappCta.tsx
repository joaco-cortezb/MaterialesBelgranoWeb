import { FaWhatsapp } from "react-icons/fa6";
import type { WhatsappSource } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { buttonClassName } from "@/components/ui/Button";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { whatsappGoHref } from "@/lib/whatsapp";

/**
 * Cierre de página: una franja verde de marca (no oscura, para que no se
 * funda con el footer) con una sola acción.
 */
export function WhatsappCta({
  source,
  title = "¿Tenés una obra o un proyecto? Pasanos el listado.",
  text = "Te cotizamos completo en minutos. Entrega en 24 hs en Mendoza, San Juan y San Luis.",
  label = "Consultar por WhatsApp",
}: {
  source: WhatsappSource;
  title?: string;
  text?: string;
  label?: string;
}) {
  return (
    <section aria-labelledby={`cta-${source}`} className="py-14 sm:py-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl bg-brand-500 px-6 py-10 text-ink-dark sm:px-12 sm:py-14">
          <div aria-hidden className="brand-slabs absolute inset-0 -z-10 opacity-60 mix-blend-multiply" />
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 id={`cta-${source}`} className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
                {title}
              </h2>
              <p className="mt-3 text-pretty text-base text-ink-dark/75 sm:text-lg">{text}</p>
            </div>
            <TrackedLink
              href={whatsappGoHref(source)}
              event="whatsapp_click"
              params={{ source }}
              className={buttonClassName({ variant: "dark", size: "lg", className: "group w-full shrink-0 sm:w-auto" })}
            >
              <FaWhatsapp className="h-6 w-6 text-whatsapp transition-transform duration-300 group-hover:-rotate-12" aria-hidden />
              {label}
            </TrackedLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
