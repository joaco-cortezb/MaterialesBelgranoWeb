import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { CategoriesBoard, type CategoryDTO } from "./CategoriesBoard";

export const dynamic = "force-dynamic";

export default async function SolucionesPage() {
  await requireSectionView("soluciones");

  let categories: CategoryDTO[] = [];
  let loadError = false;
  try {
    const [rows, brandCounts] = await Promise.all([
      prisma.category.findMany({ orderBy: { order: "asc" } }),
      prisma.brand.findMany({ select: { rubroSlugs: true } }),
    ]);
    const brandsBySlug = new Map<string, number>();
    for (const brand of brandCounts) for (const slug of brand.rubroSlugs) brandsBySlug.set(slug, (brandsBySlug.get(slug) ?? 0) + 1);
    categories = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      summary: row.summary,
      description: row.description.join("\n\n"),
      image: row.image ?? "",
      imageAlt: row.imageAlt ?? "",
      imagePosition: row.imagePosition,
      banner: row.banner ?? "",
      bannerPosition: row.bannerPosition,
      whatsappMessage: row.whatsappMessage,
      seoTitle: row.seoTitle ?? "",
      seoDescription: row.seoDescription ?? "",
      active: row.active,
      brands: brandsBySlug.get(row.slug) ?? 0,
    }));
  } catch (error) {
    console.error("No se pudieron leer las soluciones", error);
    loadError = true;
  }

  return <CategoriesBoard categories={categories} webUrl={env.PUBLIC_WEB_URL} loadError={loadError} />;
}
