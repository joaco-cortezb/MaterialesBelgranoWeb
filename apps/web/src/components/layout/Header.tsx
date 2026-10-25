import { FaWhatsapp } from "react-icons/fa6";
import { NAV_LINKS, SITE } from "@mb/shared";
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
 * Barra fija translúcida (`backdrop-blur` sobre lo que pasa por detrás),
 * simétrica respecto del logo:
 * desktop  [Tienda online]   Inicio · Soluciones  [logo]  Marcas · Nosotros   [WhatsApp]
 * mobile   [menú]                                 [logo]                      [WhatsApp]
 */
export function Header() {
  const whatsappHref = whatsappGoHref("header");

  return (
    <header className="sticky top-0 z-40 bg-surface/55 backdrop-blur-xl backdrop-saturate-150">
      <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-5 sm:h-20 lg:gap-10 xl:gap-14">
        <div className="flex items-center justify-between gap-4 lg:justify-end xl:justify-between">
          <MobileMenu links={NAV_LINKS} whatsappHref={whatsappHref} />
          {/* Wrapper aparte: `hidden` y el `inline-flex` del botón se pisarían. */}
          <div className="hidden xl:block">
            <TrackedLink
              href={SITE.distribuidora370.url}
              event="distribuidora_click"
              params={{ source: "header" }}
              external
              className={buttonClassName({ variant: "outline", size: "compact" })}
            >
              Tienda online ↗
            </TrackedLink>
          </div>
          <nav aria-label="Principal" className="hidden lg:block">
            <NavLinks links={LEFT_LINKS} />
          </nav>
        </div>

        <Logo priority />

        <div className="flex items-center justify-between gap-4">
          <nav aria-label="Secciones" className="hidden lg:block">
            <NavLinks links={RIGHT_LINKS} />
          </nav>
          <TrackedLink
            href={whatsappHref}
            event="whatsapp_click"
            params={{ source: "header" }}
            aria-label="Consultar por WhatsApp"
            className={buttonClassName({ variant: "whatsapp", size: "compact", className: "ml-auto h-11 w-11 !px-0 sm:w-auto sm:!px-5 lg:ml-0" })}
          >
            <FaWhatsapp className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">WhatsApp</span>
          </TrackedLink>
        </div>
      </Container>
    </header>
  );
}
