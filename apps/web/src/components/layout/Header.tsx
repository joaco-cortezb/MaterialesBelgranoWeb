import { FaWhatsapp } from "react-icons/fa6";
import { LuArrowUpRight, LuShoppingBag } from "react-icons/lu";
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
    <header className="sticky top-0 z-40 border-b border-ink-dark/20 bg-surface/55 backdrop-blur-xl backdrop-saturate-150">
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
              className="pressable group inline-flex h-10 items-center gap-2 rounded-full bg-ink-dark/[0.06] pl-1.5 pr-4 text-sm font-semibold text-ink-dark hover:bg-ink-dark hover:text-white"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-brand-700 shadow-sm">
                <LuShoppingBag className="h-3.5 w-3.5" aria-hidden />
              </span>
              Tienda online
              <LuArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100" aria-hidden />
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
            className={buttonClassName({ variant: "primary", size: "compact", className: "ml-auto h-11 w-11 !rounded-full !px-0 sm:w-auto sm:!px-5 lg:ml-0" })}
          >
            <FaWhatsapp className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">WhatsApp</span>
          </TrackedLink>
        </div>
      </Container>
    </header>
  );
}
