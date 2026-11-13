import { FaClock, FaEnvelope, FaLocationDot, FaPhone, FaTruckFast, FaWhatsapp } from "react-icons/fa6";
import { LuArrowUpRight } from "react-icons/lu";
import { cn, formatWhatsappPhone, SITE, type WhatsappNumber } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { MAPS_LINK, MapEmbed } from "@/components/contact/MapEmbed";
import { whatsappGoHref } from "@/lib/whatsapp";

const AUDIENCE_LABEL: Record<WhatsappNumber["audience"], string> = {
  GENERAL: "Particulares y mostrador",
  EMPRESAS: "Mayoristas y empresas",
};

/**
 * Contacto (al final de Nosotros, ancla `#contacto`): los WhatsApp primero,
 * después los datos en cards con ícono y, al final, el mapa centrado.
 */
export function ContactSection({ whatsapps }: { whatsapps: WhatsappNumber[] }) {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading id="contacto-title" eyebrow="Contacto" title="Hablemos" text="La forma más rápida es WhatsApp: mandá tu consulta o tu listado." align="center" />

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          {whatsapps.map((number) => (
            <TrackedLink
              key={number.id}
              href={whatsappGoHref("contacto", number.id === "fallback" ? undefined : number.id)}
              event="whatsapp_click"
              params={{ source: "contacto", audience: number.audience }}
              className="group flex flex-1 items-center gap-4 rounded-2xl bg-ink-dark px-5 py-4 text-white transition-[transform,background-color] duration-300 ease-[var(--ease-out-strong)] hover:-translate-y-0.5 hover:bg-ink active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none sm:max-w-sm"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-whatsapp text-ink-dark transition-transform duration-300 group-hover:scale-110">
                <FaWhatsapp className="h-6 w-6" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block font-sub text-[11px] uppercase tracking-[0.04em] text-brand-300">
                  {AUDIENCE_LABEL[number.audience]}
                </span>
                <span className="mt-1 block truncate text-base font-bold">{number.label}</span>
                <span className="mt-0.5 block text-sm tabular-nums text-white/75">{formatWhatsappPhone(number.phone)}</span>
              </span>
              <LuArrowUpRight className="h-4 w-4 shrink-0 text-white/50 transition-colors duration-200 group-hover:text-brand-300" aria-hidden />
            </TrackedLink>
          ))}
        </div>

        <dl className="mx-auto mt-10 grid max-w-4xl grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 sm:gap-4">
          <InfoCard icon={<FaLocationDot />} label="Dirección" href={MAPS_LINK} external hint="Abrir en Google Maps">
            <address className="not-italic">{SITE.address.singleLine}</address>
          </InfoCard>
          <InfoCard icon={<FaClock />} label="Horarios">
            {SITE.hours.map((slot) => (
              <div key={slot.days} className="tabular-nums">
                {slot.days}: {slot.opens} a {slot.closes} hs
              </div>
            ))}
          </InfoCard>
          <InfoCard icon={<FaPhone />} label="Teléfono" href={`tel:${SITE.phone.e164}`} hint="Llamar">
            <span className="tabular-nums">{SITE.phone.display}</span>
          </InfoCard>
          <InfoCard icon={<FaEnvelope />} label="Email" href={`mailto:${SITE.email}`} hint="Escribir un email">
            <span className="text-sm tracking-tight [overflow-wrap:anywhere] sm:text-[15px] sm:tracking-normal">{SITE.email}</span>
          </InfoCard>
        </dl>

        <p className="mx-auto mt-6 flex max-w-3xl items-start justify-center gap-2 text-sm text-ink-soft sm:items-center sm:text-center">
          <FaTruckFast className="mt-0.5 h-4 w-4 shrink-0 text-brand-700 sm:mt-0" aria-hidden />
          Entrega en 24 hs con transporte propio en {SITE.deliveryRegions.join(", ")}. Resto del país por {SITE.nationalCarrier}.
        </p>

        <div className="mx-auto mt-12 max-w-5xl">
          <MapEmbed />
          <div className="mt-4 text-center">
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-dark px-6 text-sm font-semibold text-white hover:bg-ink"
            >
              <FaLocationDot className="h-4 w-4 text-brand-400" aria-hidden /> Cómo llegar
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Dato de contacto. Con `href` toda la card es el link (el `<a>` se estira con
 * `after:inset-0`): en celular se toca la card entera, no sólo el texto.
 */
function InfoCard({
  icon,
  label,
  href,
  external = false,
  hint,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  external?: boolean;
  /** Qué pasa al tocar la card; se lee junto con el dato en lectores de pantalla. */
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative flex min-h-[4.75rem] min-w-0 items-center gap-3 rounded-2xl border border-line bg-bg px-4 py-4 sm:gap-4 sm:px-5",
        href && "card-hover pressable",
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-ink-dark [&>svg]:h-[18px] [&>svg]:w-[18px]" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <dt className="font-sub text-[11px] uppercase tracking-[0.04em] text-ink-soft">{label}</dt>
        <dd className="mt-0.5 text-[15px] leading-snug text-ink-dark">
          {href ? (
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-2xl after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-600"
            >
              {children}
              {hint && <span className="sr-only"> ({hint})</span>}
            </a>
          ) : (
            children
          )}
        </dd>
      </div>
      {href && <LuArrowUpRight className="h-4 w-4 shrink-0 text-ink-soft transition-colors duration-200 group-hover:text-brand-700" aria-hidden />}
    </div>
  );
}
