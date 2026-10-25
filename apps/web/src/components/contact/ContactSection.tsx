import { FaClock, FaEnvelope, FaLocationDot, FaPhone, FaTruckFast, FaWhatsapp } from "react-icons/fa6";
import { formatWhatsappPhone, SITE, type WhatsappNumber } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { whatsappGoHref } from "@/lib/whatsapp";

const AUDIENCE_LABEL: Record<WhatsappNumber["audience"], string> = {
  GENERAL: "Particulares y mostrador",
  EMPRESAS: "Empresas e instaladores",
};

/**
 * Contacto (al final de Nosotros, ancla `#contacto`): los WhatsApp primero,
 * después los datos en cards con ícono y, al final, el mapa centrado.
 */
export function ContactSection({ whatsapps }: { whatsapps: WhatsappNumber[] }) {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="scroll-mt-20 bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Contacto" title="Hablemos" text="La forma más rápida es WhatsApp: mandá tu consulta o tu listado." align="center" />
        <h2 id="contacto-title" className="sr-only">
          Contacto
        </h2>

        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2 sm:gap-4">
          {whatsapps.map((number) => (
            <TrackedLink
              key={number.id}
              href={whatsappGoHref("contacto", number.id === "fallback" ? undefined : number.id)}
              event="whatsapp_click"
              params={{ source: "contacto", audience: number.audience }}
              className="group flex items-center gap-4 rounded-2xl bg-ink-dark p-4 text-white transition-[transform,background-color] duration-300 ease-[var(--ease-out-strong)] hover:-translate-y-0.5 hover:bg-ink sm:p-5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-whatsapp text-ink-dark transition-transform duration-300 group-hover:scale-110">
                <FaWhatsapp className="h-6 w-6" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-condensed text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">
                  {AUDIENCE_LABEL[number.audience]}
                </span>
                <span className="block truncate text-base font-bold">{number.label}</span>
                <span className="block font-condensed text-lg text-white/75">{formatWhatsappPhone(number.phone)}</span>
              </span>
            </TrackedLink>
          ))}
        </div>

        <dl className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <InfoCard icon={<FaLocationDot />} label="Dirección">
            <address className="not-italic">{SITE.address.singleLine}</address>
          </InfoCard>
          <InfoCard icon={<FaClock />} label="Horarios">
            {SITE.hours.map((slot) => (
              <div key={slot.days}>
                {slot.days}: {slot.opens} a {slot.closes} hs
              </div>
            ))}
          </InfoCard>
          <InfoCard icon={<FaPhone />} label="Teléfono">
            <a href={`tel:${SITE.phone.e164}`} className="hover:text-brand-700">
              {SITE.phone.display}
            </a>
          </InfoCard>
          <InfoCard icon={<FaEnvelope />} label="Email">
            <a href={`mailto:${SITE.email}`} className="break-all hover:text-brand-700">
              {SITE.email}
            </a>
          </InfoCard>
        </dl>

        <p className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center text-sm text-ink-soft">
          <FaTruckFast className="h-4 w-4 shrink-0 text-brand-700" aria-hidden />
          Entrega en 24 hs con transporte propio en {SITE.deliveryRegions.join(", ")}. Resto del país por {SITE.nationalCarrier}.
        </p>

        <div className="mx-auto mt-12 max-w-5xl">
          <MapEmbed />
        </div>
      </Container>
    </section>
  );
}

function InfoCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-bg px-5 py-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-ink-dark [&>svg]:h-5 [&>svg]:w-5" aria-hidden>
        {icon}
      </span>
      <dt className="mt-3 font-condensed text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">{label}</dt>
      <dd className="mt-1 text-[15px] leading-relaxed text-ink-dark">{children}</dd>
    </div>
  );
}
