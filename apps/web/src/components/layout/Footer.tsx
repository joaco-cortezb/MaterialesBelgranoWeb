import Link from "next/link";
import { FaClock, FaEnvelope, FaFacebook, FaInstagram, FaLocationDot, FaPhone, FaYoutube } from "react-icons/fa6";
import { NAV_LINKS, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Logo } from "@/components/layout/Logo";

const SOCIAL = [
  { href: SITE.social.instagram, label: "Instagram", Icon: FaInstagram },
  { href: SITE.social.facebook, label: "Facebook", Icon: FaFacebook },
  { href: SITE.social.youtube, label: "YouTube", Icon: FaYoutube },
];

const BUCLY_URL = "https://bucly.tech/?utm_source=materialesbelgrano.com&utm_medium=footer&utm_campaign=desarrollado-por";

/** Footer oscuro: logo grande, los datos que importan y poco más. */
export function Footer() {
  return (
    <footer className="bg-ink-dark text-white">
      <Container className="py-14 sm:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md space-y-5">
            <Logo variant="light" size="lg" />
            <p className="text-pretty text-[15px] leading-relaxed text-white/65">
              Materiales eléctricos e iluminación para instaladores, empresas y hogares. Entrega en 24 hs en {SITE.deliveryRegions.join(", ")} y envíos a todo el país.
            </p>
            <ul className="flex gap-2" aria-label="Redes sociales">
              {SOCIAL.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="pressable flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-brand-400 hover:text-brand-400"
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <address className="grid gap-4 not-italic text-[15px] text-white/80 sm:grid-cols-2 lg:max-w-lg">
            <InfoRow icon={<FaLocationDot />}>{SITE.address.singleLine}</InfoRow>
            <InfoRow icon={<FaClock />}>
              {SITE.hours.map((slot) => (
                <span key={slot.days} className="block">
                  {slot.days}: {slot.opens} a {slot.closes} hs
                </span>
              ))}
            </InfoRow>
            <InfoRow icon={<FaPhone />}>
              <a href={`tel:${SITE.phone.e164}`} className="hover:text-white">
                {SITE.phone.display}
              </a>
            </InfoRow>
            <InfoRow icon={<FaEnvelope />}>
              <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">
                {SITE.email}
              </a>
            </InfoRow>
          </address>
        </div>

        <nav aria-label="Pie de página" className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm font-semibold">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="inline-flex min-h-9 items-center text-white/70 hover:text-white">
              {link.label}
            </Link>
          ))}
          <TrackedLink
            href={SITE.distribuidora370.url}
            event="distribuidora_click"
            params={{ source: "footer" }}
            external
            className="inline-flex min-h-9 items-center text-brand-400 hover:text-brand-300"
          >
            Tienda online: {SITE.distribuidora370.name} ↗
          </TrackedLink>
        </nav>

        <div className="mt-6 flex flex-col gap-3 pb-20 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:pb-0">
          <p>
            © {new Date().getFullYear()} {SITE.legalName} · {SITE.name}
          </p>
          <a
            href={BUCLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bucly-credit group inline-flex min-h-9 items-center gap-1.5 self-start font-semibold text-white/60 sm:self-auto"
          >
            Desarrollado por <span className="bucly-shimmer">Bucly</span>
            <span aria-hidden className="inline-block transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </Container>
    </footer>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/8 text-brand-400 [&>svg]:h-3.5 [&>svg]:w-3.5" aria-hidden>
        {icon}
      </span>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
