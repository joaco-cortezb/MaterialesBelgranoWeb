import { FaWhatsapp } from "react-icons/fa6";
import { NAV_LINKS } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { buttonClassName } from "@/components/ui/Button";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Logo } from "@/components/layout/Logo";
import { NavLinks } from "@/components/layout/NavLinks";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { whatsappGoHref } from "@/lib/whatsapp";

export function Header() {
  const whatsappHref = whatsappGoHref("header");

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Logo priority />

        <nav aria-label="Principal" className="hidden lg:block">
          <NavLinks links={NAV_LINKS} />
        </nav>

        <div className="flex items-center gap-2">
          <TrackedLink
            href={whatsappHref}
            event="whatsapp_click"
            params={{ source: "header" }}
            className={buttonClassName({ variant: "whatsapp", size: "compact", className: "hidden sm:inline-flex" })}
          >
            <FaWhatsapp className="h-5 w-5" aria-hidden />
            WhatsApp
          </TrackedLink>
          <MobileMenu links={NAV_LINKS} whatsappHref={whatsappHref} />
        </div>
      </Container>
    </header>
  );
}
