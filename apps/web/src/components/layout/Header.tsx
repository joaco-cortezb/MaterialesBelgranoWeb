import { FaWhatsapp } from "react-icons/fa6";
import { NAV_LINKS } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { buttonClassName } from "@/components/ui/Button";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Logo } from "@/components/layout/Logo";
import { NavLinks } from "@/components/layout/NavLinks";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { whatsappGoHref } from "@/lib/whatsapp";

/** El menú se parte en dos mitades a los lados del logo. */
const SPLIT = Math.ceil(NAV_LINKS.length / 2);
const LEFT_LINKS = NAV_LINKS.slice(0, SPLIT);
const RIGHT_LINKS = NAV_LINKS.slice(SPLIT);

/**
 * Barra fija translúcida (`backdrop-blur` sobre lo que pasa por detrás).
 * Desktop: Inicio · Rubros [logo] Marcas · Nosotros, y WhatsApp en el borde.
 * Mobile: hamburguesa [logo] WhatsApp.
 */
export function Header() {
  const whatsappHref = whatsappGoHref("header");

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-surface/55 backdrop-blur-xl backdrop-saturate-150">
      <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-5 sm:h-20 lg:gap-8">
        <div className="flex items-center justify-start lg:justify-end">
          <MobileMenu links={NAV_LINKS} whatsappHref={whatsappHref} />
          <nav aria-label="Principal" className="hidden lg:block">
            <NavLinks links={LEFT_LINKS} />
          </nav>
        </div>

        <Logo priority />

        <div className="flex items-center justify-end gap-5">
          <nav aria-label="Secciones" className="hidden lg:block lg:mr-auto">
            <NavLinks links={RIGHT_LINKS} />
          </nav>
          <TrackedLink
            href={whatsappHref}
            event="whatsapp_click"
            params={{ source: "header" }}
            aria-label="Consultar por WhatsApp"
            className={buttonClassName({ variant: "whatsapp", size: "compact", className: "h-11 w-11 !px-0 sm:w-auto sm:!px-5" })}
          >
            <FaWhatsapp className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">WhatsApp</span>
          </TrackedLink>
        </div>
      </Container>
    </header>
  );
}
