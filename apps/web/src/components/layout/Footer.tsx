import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
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

/** Footer oscuro y compacto: logo, datos de contacto, menú y crédito. */
export function Footer() {
  return (
    <footer className="bg-ink-dark text-white">
      <Container className="py-10 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Logo variant="light" size="lg" />

          <address className="grid gap-x-10 gap-y-1.5 text-sm not-italic text-white/75 sm:grid-cols-2">
            <span>{SITE.address.singleLine}</span>
            <span>
              {SITE.hours.map((slot) => `${slot.days} ${slot.opens}–${slot.closes} hs`).join(" · ")}
            </span>
            <a href={`tel:${SITE.phone.e164}`} className="hover:text-white">
              {SITE.phone.display}
            </a>
            <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">
              {SITE.email}
            </a>
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

        {/* `pr-20` en desktop y `pb-20` en mobile dejan lugar al botón flotante de WhatsApp. */}
        <div className="mt-4 flex flex-col gap-2 pb-20 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:pb-0 sm:pr-20">
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
