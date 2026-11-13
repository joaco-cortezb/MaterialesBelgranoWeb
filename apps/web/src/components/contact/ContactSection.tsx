import { FaClock, FaEnvelope, FaLocationDot, FaPhone, FaTruckFast, FaWhatsapp } from "react-icons/fa6";
import { LuArrowUpRight } from "react-icons/lu";
import { formatWhatsappPhone, SITE, type WhatsappNumber } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CopyButton } from "@/components/contact/CopyButton";
import { MAPS_LINK, MapEmbed } from "@/components/contact/MapEmbed";
import { whatsappGoHref } from "@/lib/whatsapp";

const AUDIENCE_LABEL: Record<WhatsappNumber["audience"], string> = {
  GENERAL: "Particulares y mostrador",
  EMPRESAS: "Mayoristas y empresas",
};

/**
 * Contacto (al final de Nosotros, ancla `#contacto`) como un solo panel en
 * grilla (adaptado de "Contact Page" de Efferd, vía 21st.dev): arriba el
 * título con los WhatsApp y el mapa al lado; abajo los datos en columnas con
 * encabezado, cada uno con su acción (abrir, llamar, escribir o copiar).
 */
export function ContactSection({ whatsapps }: { whatsapps: WhatsappNumber[] }) {
  const [emailUser, emailDomain] = SITE.email.split("@");
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="bg-bg py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_24px_60px_-40px_rgba(35,35,35,0.35)]">
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12">
              <Eyebrow>Contacto</Eyebrow>
              <h2 id="contacto-title" className="mt-2 text-3xl font-extrabold tracking-tight text-ink-dark sm:text-4xl">
                Hablemos
              </h2>
              <p className="mt-3 max-w-md text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
                La forma más rápida es WhatsApp: mandá tu consulta o tu listado.
              </p>

              <div className="mt-7 flex flex-col gap-3">
                {whatsapps.map((number) => (
                  <TrackedLink
                    key={number.id}
                    href={whatsappGoHref("contacto", number.id === "fallback" ? undefined : number.id)}
                    event="whatsapp_click"
                    params={{ source: "contacto", audience: number.audience }}
                    className="group flex items-center gap-4 rounded-2xl bg-ink-dark px-4 py-3.5 text-white transition-[transform,background-color] duration-300 ease-[var(--ease-out-strong)] hover:-translate-y-0.5 hover:bg-ink active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none sm:px-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-whatsapp text-ink-dark transition-transform duration-300 group-hover:scale-110">
                      <FaWhatsapp className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-brand-300">{AUDIENCE_LABEL[number.audience]}</span>
                      <span className="mt-1 flex flex-wrap items-baseline gap-x-2">
                        <span className="truncate text-base font-bold">{number.label}</span>
                        <span className="text-sm tabular-nums text-white/75">{formatWhatsappPhone(number.phone)}</span>
                      </span>
                    </span>
                    <LuArrowUpRight className="h-4 w-4 shrink-0 text-white/50 transition-colors duration-200 group-hover:text-brand-300" aria-hidden />
                  </TrackedLink>
                ))}
              </div>
            </div>

            <div className="relative min-h-[300px] border-t border-line bg-surface-2 lg:min-h-[420px] lg:border-l lg:border-t-0">
              <MapEmbed className="absolute inset-0" />
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-dark px-5 text-sm font-semibold text-white shadow-lg hover:bg-ink"
              >
                <FaLocationDot className="h-4 w-4 text-brand-400" aria-hidden /> Cómo llegar
              </a>
            </div>
          </div>

          <dl className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-[1fr_1.25fr_0.9fr_1.35fr]">
            <InfoCell icon={<FaLocationDot />} label="Dirección" className="border-b sm:border-r lg:border-b-0">
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="rounded underline-offset-4 hover:underline">
                <address className="not-italic">
                  {SITE.address.street}
                  <br />
                  {SITE.address.locality}, {SITE.address.region}
                </address>
              </a>
              <CopyButton value={SITE.address.singleLine} label="la dirección" />
            </InfoCell>
            <InfoCell icon={<FaClock />} label="Horarios" className="border-b lg:border-b-0 lg:border-r">
              <div>
                {SITE.hours.map((slot) => (
                  <div key={slot.days} className="whitespace-nowrap tabular-nums">
                    <span className="text-ink-soft">{slot.days}:</span> {slot.opens} a {slot.closes} hs
                  </div>
                ))}
              </div>
            </InfoCell>
            <InfoCell icon={<FaPhone />} label="Teléfono" className="border-b sm:border-b-0 sm:border-r">
              <a href={`tel:${SITE.phone.e164}`} className="whitespace-nowrap rounded tabular-nums underline-offset-4 hover:underline">
                {SITE.phone.display}
              </a>
              <CopyButton value={SITE.phone.display} label="el teléfono" />
            </InfoCell>
            <InfoCell icon={<FaEnvelope />} label="Email">
              <a href={`mailto:${SITE.email}`} className="min-w-0 rounded text-sm tracking-tight underline-offset-4 hover:underline sm:text-[15px] sm:tracking-normal lg:text-sm xl:text-[15px]">
                {/* Si no entra en una línea, corta prolijo en la arroba. */}
                {emailUser}
                <wbr />@{emailDomain}
              </a>
              <CopyButton value={SITE.email} label="el email" />
            </InfoCell>
          </dl>

          <p className="flex items-start gap-2.5 border-t border-line bg-bg px-6 py-4 text-sm text-ink-soft sm:items-center sm:px-10">
            <FaTruckFast className="mt-0.5 h-4 w-4 shrink-0 text-brand-700 sm:mt-0" aria-hidden />
            Entrega en 24 hs con transporte propio en {SITE.deliveryRegions.join(", ")}. Resto del país por {SITE.nationalCarrier}.
          </p>
        </div>
      </Container>
    </section>
  );
}

/** Columna de dato: encabezado con ícono y etiqueta, y abajo el valor con su acción. */
function InfoCell({ icon, label, className, children }: { icon: React.ReactNode; label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex min-w-0 flex-col border-line ${className ?? ""}`}>
      <dt className="flex items-center gap-2.5 border-b border-line bg-bg px-6 py-3 font-sub text-[13px] uppercase text-ink-dark sm:px-7">
        <span className="text-brand-700 [&>svg]:h-3.5 [&>svg]:w-3.5" aria-hidden>
          {icon}
        </span>
        {label}
      </dt>
      <dd className="flex min-h-[4.5rem] flex-1 items-center justify-between gap-2 px-6 py-4 text-[15px] leading-snug text-ink-dark sm:px-7 lg:px-5 xl:px-7">{children}</dd>
    </div>
  );
}
