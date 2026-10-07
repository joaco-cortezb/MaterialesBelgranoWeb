import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { ROUTES, type ImageSlot, type Rubro } from "@mb/shared";
import { Media } from "@/components/ui/Media";
import { RubroIcon } from "@/components/rubros/RubroIcon";

export function RubroCard({ rubro, image }: { rubro: Rubro; image: ImageSlot | null }) {
  return (
    <Link
      href={ROUTES.rubro(rubro.slug)}
      className="card-hover pressable group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div className="relative aspect-[16/10]">
        {image ? (
          <Media src={image.url} alt={image.alt} position={image.position} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="absolute inset-0" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-300 text-brand-800">
            <RubroIcon slug={rubro.slug} className="h-14 w-14" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold tracking-tight text-ink-dark">{rubro.name}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{rubro.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-brand-700">
          Ver rubro
          <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
