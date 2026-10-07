import { FaWhatsapp } from "react-icons/fa6";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { whatsappGoHref } from "@/lib/whatsapp";

/**
 * Botón flotante. Abajo a la derecha, respeta el safe-area del iPhone y el
 * footer deja espacio (`pb-24` en mobile) para que no tape ningún CTA.
 */
export function WhatsappFloat() {
  return (
    <TrackedLink
      href={whatsappGoHref("flotante")}
      event="whatsapp_click"
      params={{ source: "flotante" }}
      aria-label="Consultar por WhatsApp"
      className="pressable fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-ink-dark shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] hover:brightness-105 sm:right-6"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
    >
      <FaWhatsapp className="h-7 w-7" aria-hidden />
    </TrackedLink>
  );
}
