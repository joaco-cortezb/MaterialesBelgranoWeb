import Image from "next/image";
import Link from "next/link";
import { FaClock, FaEnvelope, FaFacebook, FaInstagram, FaLocationDot, FaPhone, FaYoutube } from "react-icons/fa6";
import { NAV_LINKS, ROUTES, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { TrackedLink } from "@/components/analytics/TrackedLink";

const SOCIAL = [
  { href: SITE.social.instagram, label: "Instagram", Icon: FaInstagram },
  { href: SITE.social.facebook, label: "Facebook", Icon: FaFacebook },
  { href: SITE.social.youtube, label: "YouTube", Icon: FaYoutube },
];

const BUCLY_URL = "https://bucly.tech/?utm_source=materialesbelgrano.com&utm_medium=footer&utm_campaign=desarrollado-por";

/** Footer oscuro: logo oficial, datos de contacto con íconos, menú y crédito. */
export function Footer() {
  return (
    <footer className="bg-ink-dark text-white">
      <Container className="py-10 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Link href={ROUTES.home} aria-label={`${SITE.name}: ir al inicio`} className="shrink-0 self-start transition-transform duration-300 hover:scale-[1.04] lg:self-center">
            {/* Logo oficial de la marca (versión en círculo verde, pensada para fondos de color). */}
            <Image src="/brand/logo-materiales-belgrano-circulo.png" alt={SITE.name} width={400} height={400} sizes="112px" className="h-24 w-24 sm:h-28 sm:w-28" />
          </Link>

          <address className="grid gap-x-10 gap-y-4 not-italic sm:grid-cols-2">
            <FooterItem icon={<FaLocationDot />} label="Dirección">
              {SITE.address.singleLine}
            </FooterItem>
            <FooterItem icon={<FaClock />} label="Horarios">
              {SITE.hours.map((slot) => (
                <span key={slot.days} className="block">
                  {slot.days} {slot.opens}–{slot.closes} hs
                </span>
              ))}
            </FooterItem>
            <FooterItem icon={<FaPhone />} label="Teléfono">
              <a href={`tel:${SITE.phone.e164}`} className="hover:text-white">
                {SITE.phone.display}
              </a>
            </FooterItem>
            <FooterItem icon={<FaEnvelope />} label="Email">
              <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">
                {SITE.email}
              </a>
            </FooterItem>
          </address>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-white/10 pt-6">
          <nav aria-label="Pie de página" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-semibold">
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
              {SITE.distribuidora370.name} ↗
            </TrackedLink>
          </nav>
          <ul className="flex gap-1" aria-label="Redes sociales">
            {SOCIAL.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="pressable flex h-10 w-10 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-brand-400"
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName} · {SITE.name}
          </p>
          <a href={BUCLY_URL} target="_blank" rel="noopener noreferrer" className="bucly-credit inline-flex min-h-9 items-center self-start font-semibold sm:self-auto">
            <span className="bucly-shimmer border-b border-transparent transition-colors duration-200 hover:border-brand-400">Desarrollado por Bucly</span>
          </a>
        </div>
      </Container>
    </footer>
  );
}

function FooterItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/30 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0 text-sm">
        <span className="block font-condensed text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</span>
        <span className="mt-0.5 block leading-relaxed text-white/80">{children}</span>
      </div>
    </div>
  );
}
