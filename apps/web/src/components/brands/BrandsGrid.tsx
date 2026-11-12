import type { Brand } from "@mb/shared";
import { BrandCardList } from "@/components/brands/BrandCard";

/**
 * Grilla de marcas de una solución. Cada marca abre el catálogo del fabricante
 * en otra pestaña; el clic se mide en GA4 con el nombre de la marca.
 */
export function BrandsGrid({ brands, source }: { brands: Brand[]; source: string }) {
  if (brands.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-surface px-6 py-10 text-center text-sm text-ink-soft">
        Las marcas se cargan desde el panel de administración. {/* TODO(cliente): logos y catálogos */}
      </p>
    );
  }

  return <BrandCardList brands={brands} source={source} />;
}
