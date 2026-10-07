import { FaClock, FaEnvelope, FaLocationDot, FaPhone, FaTruckFast, FaWhatsapp } from "react-icons/fa6";
import { formatWhatsappPhone, SITE, type WhatsappNumber } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { buttonClassName } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { whatsappGoHref } from "@/lib/whatsapp";

/** Sección de contacto (vive al final de Nosotros, con ancla `#contacto`). */
export function ContactSection({ whatsapps }: { whatsapps: WhatsappNumber[] }) {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="scroll-mt-20 bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Contacto"
          title="Escribinos, llamanos o pasá por el local"
          text="La forma más rápida es WhatsApp: mandá tu consulta o listado y te respondemos en el horario de atención."
        />
        <h2 id="contacto-title" className="sr-only">
          Contacto
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-8">
            <div className="space-y-3">
              {whatsapps.map((number) => (
                <TrackedLink
                  key={number.id}
                  href={whatsappGoHref("contacto", number.id === "fallback" ? undefined : number.id)}
                  event="whatsapp_click"
                  params={{ source: "contacto", audience: number.audience }}
                  className={buttonClassName({ variant: "whatsapp", size: "lg", className: "w-full justify-between" })}
                >
                  <span className="flex items-center gap-3">
                    <FaWhatsapp className="h-6 w-6" aria-hidden />
                    {number.label}
                  </span>
                  <span className="font-condensed text-lg">{formatWhatsappPhone(number.phone)}</span>
                </TrackedLink>
              ))}
            </div>

            <dl className="divide-y divide-line rounded-2xl border border-line bg-bg">
              <ContactRow icon={<FaLocationDot />} label="Dirección">
                <address className="not-italic">{SITE.address.singleLine}</address>
              </ContactRow>
              <ContactRow icon={<FaClock />} label="Horarios">
                {SITE.hours.map((slot) => (
                  <div key={slot.days}>
                    {slot.days}: {slot.opens} a {slot.closes} hs
                  </div>
                ))}
              </ContactRow>
              <ContactRow icon={<FaPhone />} label="Teléfono">
                <a href={`tel:${SITE.phone.e164}`} className="hover:text-brand-700">
                  {SITE.phone.display}
                </a>
              </ContactRow>
              <ContactRow icon={<FaEnvelope />} label="Email">
                <a href={`mailto:${SITE.email}`} className="break-all hover:text-brand-700">
                  {SITE.email}
                </a>
              </ContactRow>
              <ContactRow icon={<FaTruckFast />} label="Zonas de entrega">
                Entrega en 24 hs con transporte propio en {SITE.deliveryRegions.join(", ")}. Resto del país por {SITE.nationalCarrier}.
              </ContactRow>
            </dl>
          </div>

          <MapEmbed />
        </div>
      </Container>
    </section>
  );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 px-5 py-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-800 [&>svg]:h-4 [&>svg]:w-4" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="font-condensed text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">{label}</dt>
        <dd className="mt-0.5 text-[15px] leading-relaxed text-ink">{children}</dd>
      </div>
    </div>
  );
}
