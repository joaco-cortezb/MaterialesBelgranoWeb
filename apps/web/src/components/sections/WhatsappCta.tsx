import { FaWhatsapp } from "react-icons/fa6";
import type { WhatsappSource } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { buttonClassName } from "@/components/ui/Button";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { whatsappGoHref } from "@/lib/whatsapp";

/** Bloque de cierre de página: una sola acción, bien grande. */
export function WhatsappCta({
  source,
  title = "¿Tenés una obra o un proyecto? Pasanos el listado.",
  text = "Mandanos por WhatsApp lo que necesitás y te cotizamos completo en minutos. Entrega en 24 hs en Mendoza, San Juan y San Luis.",
  label = "Consultar por WhatsApp",
}: {
  source: WhatsappSource;
  title?: string;
  text?: string;
  label?: string;
}) {
  return (
    <section aria-labelledby={`cta-${source}`} className="bg-ink-dark py-16 text-white sm:py-20">
      <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 id={`cta-${source}`} className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-pretty text-base text-white/75 sm:text-lg">{text}</p>
        </div>
        <TrackedLink
          href={whatsappGoHref(source)}
          event="whatsapp_click"
          params={{ source }}
          className={buttonClassName({ variant: "whatsapp", size: "lg", className: "w-full sm:w-auto" })}
        >
          <FaWhatsapp className="h-6 w-6" aria-hidden />
          {label}
        </TrackedLink>
      </Container>
    </section>
  );
}
