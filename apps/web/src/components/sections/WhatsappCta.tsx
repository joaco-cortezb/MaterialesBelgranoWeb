import { FaWhatsapp } from "react-icons/fa6";
import type { WhatsappSource } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { whatsappGoHref } from "@/lib/whatsapp";

/**
 * Cierre de página: franja verde de marca. Toda la franja es el link a
 * WhatsApp; la píldora oscura con texto lo dice sin dejar dudas (un ícono
 * solo no se lee como botón).
 */
export function WhatsappCta({
  source,
  title = "¿Tenés una obra o un proyecto? Pasanos el listado.",
  text = "Te cotizamos todo junto por WhatsApp.",
}: {
  source: WhatsappSource;
  title?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby={`cta-${source}`} className="py-14 sm:py-20">
      <Container>
        <TrackedLink
          href={whatsappGoHref(source)}
          event="whatsapp_click"
          params={{ source }}
          className="group relative isolate flex flex-col items-start gap-7 overflow-hidden rounded-3xl bg-brand-500 px-6 py-9 text-ink-dark sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-12 sm:py-14"
        >
          <div aria-hidden className="brand-slabs absolute inset-0 -z-10 opacity-60 mix-blend-multiply" />
          <div className="max-w-2xl">
            <h2 id={`cta-${source}`} className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-pretty text-base text-ink-dark/75 sm:text-lg">{text}</p>
          </div>
          <span className="inline-flex min-h-13 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-ink-dark px-7 text-base font-semibold text-white transition-[background-color,transform] duration-300 ease-[var(--ease-out-strong)] group-hover:bg-ink group-active:scale-[0.97] sm:w-auto">
            <FaWhatsapp className="h-5 w-5 text-whatsapp transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:-rotate-12 group-hover:scale-110" aria-hidden />
            Escribir por WhatsApp
          </span>
        </TrackedLink>
      </Container>
    </section>
  );
}
