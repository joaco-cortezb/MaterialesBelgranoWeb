import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import { NAV_LINKS, ROUTES, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { MAPS_LINK } from "@/components/contact/MapEmbed";
import { FooterColumn } from "@/components/layout/FooterColumn";

const SOCIAL = [
  { href: SITE.social.instagram, label: "Instagram", Icon: FaInstagram },
  { href: SITE.social.facebook, label: "Facebook", Icon: FaFacebook },
  { href: SITE.social.youtube, label: "YouTube", Icon: FaYoutube },
];

const BUCLY_URL = "https://bucly.tech/?utm_source=materialesbelgrano.com&utm_medium=footer&utm_campaign=desarrollado-por";

/** Footer oscuro: logo, tres columnas de datos (acordeones en celular), menú, redes y legales. */
export function Footer() {
  return (
    <footer className="bg-ink-dark text-white">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-20">
          <Link href={ROUTES.home} aria-label={`${SITE.name}: ir al inicio`} className="shrink-0 justify-self-center transition-transform duration-300 hover:scale-[1.03] lg:justify-self-start">
            {/* Mismo logo que el menú, con "BELGRANO" en blanco para el fondo oscuro. */}
            <Image
              src="/brand/logo-materiales-belgrano-h-footer.png"
              alt={SITE.name}
              width={3272}
              height={1488}
              sizes="320px"
              className="h-28 w-auto sm:h-36"
            />
          </Link>

          <address className="grid border-t border-white/10 text-left not-italic sm:grid-cols-[1fr_1fr_auto] sm:gap-x-12 sm:gap-y-8 sm:border-0 lg:gap-x-16">
            <FooterColumn label="Visitanos">
              <span className="block">
                {SITE.address.street}
                <br />
                {SITE.address.locality}, {SITE.address.region}
              </span>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-brand-400 underline-offset-4 transition-colors hover:text-brand-300 hover:underline">
                Cómo llegar ↗
              </a>
            </FooterColumn>
            <FooterColumn label="Horarios">
              {SITE.hours.map((slot) => (
                <span key={slot.days} className="block">
                  <span className="text-white/55">{slot.days}</span>
                  <span className="block tabular-nums">
                    {slot.opens} a {slot.closes} hs
                  </span>
                </span>
              ))}
            </FooterColumn>
            <FooterColumn label="Contacto">
              <a href={`tel:${SITE.phone.e164}`} className="underline-offset-4 transition-colors hover:text-white hover:underline block w-fit tabular-nums">
                {SITE.phone.display}
              </a>
              <a href={`mailto:${SITE.email}`} className="underline-offset-4 transition-colors hover:text-white hover:underline block w-fit break-all sm:break-normal">
                {SITE.email}
              </a>
            </FooterColumn>
          </address>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 sm:justify-between gap-y-4 border-t border-white/10 pt-6">
          <nav aria-label="Pie de página" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-semibold sm:justify-start">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center text-white/70 hover:text-white">
                {link.label}
              </Link>
            ))}
            <TrackedLink
              href={SITE.distribuidora370.url}
              event="distribuidora_click"
              params={{ source: "footer" }}
              external
              className="inline-flex min-h-11 items-center text-brand-400 hover:text-brand-300"
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
                  className="pressable flex h-11 w-11 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-brand-400"
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2 text-center text-[13px] text-white/60 sm:flex-row sm:text-left sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center justify-center gap-x-2 sm:justify-start">
            <span>
              © {new Date().getFullYear()} {SITE.legalName} · {SITE.name}
            </span>
            <span aria-hidden className="max-sm:hidden">·</span>
            <Link href={ROUTES.privacidad} className="underline-offset-4 transition-colors hover:text-white hover:underline inline-flex min-h-11 items-center">
              Privacidad y cookies
            </Link>
          </p>
          <a href={BUCLY_URL} target="_blank" rel="noopener noreferrer" className="bucly-credit inline-flex min-h-11 items-center font-semibold">
            <span className="bucly-shimmer border-b border-transparent transition-colors duration-200 hover:border-brand-400">Desarrollado por Bucly</span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
