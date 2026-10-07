import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import { NAV_LINKS, ROUTES, RUBROS, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Logo } from "@/components/layout/Logo";

const SOCIAL = [
  { href: SITE.social.instagram, label: "Instagram", Icon: FaInstagram },
  { href: SITE.social.facebook, label: "Facebook", Icon: FaFacebook },
  { href: SITE.social.youtube, label: "YouTube", Icon: FaYoutube },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-ink-soft">
            Soluciones eléctricas y de iluminación para instaladores, empresas y consumidor final en Mendoza, San Juan y San Luis.
          </p>
          <ul className="flex gap-2" aria-label="Redes sociales">
            {SOCIAL.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="pressable flex h-11 w-11 items-center justify-center rounded-xl border border-line text-ink-soft hover:border-brand-400 hover:text-brand-700"
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="Navegación">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <FooterLink href={link.href}>{link.label}</FooterLink>
            </li>
          ))}
          <li>
            <TrackedLink
              href={SITE.distribuidora370.url}
              event="distribuidora_click"
              params={{ source: "footer" }}
              external
              className="inline-flex min-h-9 items-center font-semibold text-brand-700 hover:text-brand-800"
            >
              Tienda online: {SITE.distribuidora370.name} ↗
            </TrackedLink>
          </li>
        </FooterColumn>

        <FooterColumn title="Rubros">
          {RUBROS.map((rubro) => (
            <li key={rubro.slug}>
              <FooterLink href={ROUTES.rubro(rubro.slug)}>{rubro.name}</FooterLink>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contacto">
          <li>
            <address className="not-italic text-ink">{SITE.address.singleLine}</address>
          </li>
          <li>
            <a href={`tel:${SITE.phone.e164}`} className="inline-flex min-h-9 items-center hover:text-ink">
              {SITE.phone.display}
            </a>
          </li>
          <li>
            <a href={`mailto:${SITE.email}`} className="inline-flex min-h-9 items-center break-all hover:text-ink">
              {SITE.email}
            </a>
          </li>
          {SITE.hours.map((slot) => (
            <li key={slot.days} className="text-ink">
              {slot.days}: {slot.opens} a {slot.closes} hs
            </li>
          ))}
        </FooterColumn>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-5 pb-24 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:pb-5">
          <p>
            © {new Date().getFullYear()} {SITE.legalName} · {SITE.name}
          </p>
          <p>Desarrollado por Bucly</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-condensed text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">{title}</h2>
      <ul className="mt-4 space-y-1 text-sm text-ink-soft">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-9 items-center hover:text-ink">
      {children}
    </Link>
  );
}
