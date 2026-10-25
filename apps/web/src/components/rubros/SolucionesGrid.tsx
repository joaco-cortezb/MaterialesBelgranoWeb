import { FaWhatsapp } from "react-icons/fa6";
import { RUBROS, type ImageSlot, type WhatsappSource } from "@mb/shared";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { RubroCard } from "@/components/rubros/RubroCard";
import { whatsappGoHref } from "@/lib/whatsapp";

/**
 * Las cinco soluciones + una sexta celda de consulta, así la grilla cierra
 * pareja (3×2 en desktop, 2×3 en mobile) sin rellenar con fotos repetidas.
 */
export function SolucionesGrid({ images, source }: { images: Record<string, ImageSlot | null>; source: WhatsappSource }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {RUBROS.map((rubro, index) => (
        <RubroCard key={rubro.slug} rubro={rubro} image={images[rubro.imageSlot]} index={index} />
      ))}
      <TrackedLink
        href={whatsappGoHref(source)}
        event="whatsapp_click"
        params={{ source }}
        className="card-hover pressable brand-slabs group flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-ink-dark p-4 text-white sm:p-6"
      >
        <span className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-brand-400">¿No lo encontrás?</span>
        <span className="text-balance text-lg font-extrabold leading-tight tracking-tight sm:text-2xl">Mandanos el listado y te decimos si lo tenemos.</span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-whatsapp">
          <FaWhatsapp className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" aria-hidden />
          Consultar por WhatsApp
        </span>
      </TrackedLink>
    </div>
  );
}
