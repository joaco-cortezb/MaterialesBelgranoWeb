import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { ROUTES, type ImageSlot, type Rubro } from "@mb/shared";
import { Media } from "@/components/ui/Media";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";
import { RubroIcon } from "@/components/rubros/RubroIcon";

/** Card de una solución. En mobile es compacta (dos por fila, sin bajada). */
export function RubroCard({ rubro, image, index }: { rubro: Rubro; image: ImageSlot | null; index: number }) {
  return (
    <Link
      href={ROUTES.rubro(rubro.slug)}
      className="card-hover pressable group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/10]">
        {image ? (
          <Media src={image.url} alt={image.alt} position={image.position} sizes="(min-width: 1024px) 30vw, 46vw" className="absolute inset-0" />
        ) : (
          <BrandPlaceholder icon={<RubroIcon slug={rubro.slug} />} />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-0.5 font-condensed text-xs font-bold tracking-wider text-ink-dark backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-5">
        <h3 className="text-balance text-[15px] font-bold leading-snug tracking-tight text-ink-dark sm:text-lg">{rubro.name}</h3>
        <p className="hidden text-sm leading-relaxed text-ink-soft sm:block">{rubro.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-semibold text-brand-700 sm:pt-2">
          Ver solución
          <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
