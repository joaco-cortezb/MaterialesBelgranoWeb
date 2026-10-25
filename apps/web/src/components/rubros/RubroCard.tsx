import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { ROUTES, type Category } from "@mb/shared";
import { Media } from "@/components/ui/Media";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";
import { RubroIcon } from "@/components/rubros/RubroIcon";

/** Card de una solución para el índice /soluciones. En mobile es compacta. */
export function RubroCard({ category, index }: { category: Category; index: number }) {
  return (
    <Link
      href={ROUTES.rubro(category.slug)}
      className="card-hover pressable group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/10]">
        {category.image ? (
          <Media src={category.image} alt={category.imageAlt} position={category.imagePosition} sizes="(min-width: 1024px) 30vw, 46vw" className="absolute inset-0" />
        ) : (
          <BrandPlaceholder icon={<RubroIcon slug={category.slug} />} />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-0.5 font-condensed text-xs font-bold tracking-wider text-ink-dark backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center gap-2 p-3.5 text-center sm:p-5">
        <h3 className="text-balance text-[15px] font-bold leading-snug tracking-tight text-ink-dark sm:text-lg">{category.name}</h3>
        <p className="hidden text-pretty text-sm leading-relaxed text-ink-soft sm:block">{category.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-semibold text-brand-700 sm:pt-2">
          Ver solución
          <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
