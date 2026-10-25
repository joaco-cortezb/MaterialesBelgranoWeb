import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { CategoriesBoard, type CategoryDTO } from "./CategoriesBoard";

export const dynamic = "force-dynamic";

export default async function SolucionesPage() {
  await requireSectionView("soluciones");

  let categories: CategoryDTO[] = [];
  try {
    const [rows, brandCounts] = await Promise.all([
      prisma.category.findMany({ orderBy: { order: "asc" } }),
      prisma.brand.groupBy({ by: ["rubroSlug"], _count: { _all: true } }),
    ]);
    const brandsBySlug = new Map(brandCounts.map((row) => [row.rubroSlug, row._count._all]));
    categories = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      summary: row.summary,
      description: row.description.join("\n\n"),
      subcategories: row.subcategories.join("\n"),
      faqs: Array.isArray(row.faqs) ? (row.faqs as CategoryDTO["faqs"]) : [],
      image: row.image ?? "",
      imageAlt: row.imageAlt ?? "",
      imagePosition: row.imagePosition,
      whatsappMessage: row.whatsappMessage,
      seoTitle: row.seoTitle ?? "",
      seoDescription: row.seoDescription ?? "",
      active: row.active,
      brands: brandsBySlug.get(row.slug) ?? 0,
    }));
  } catch (error) {
    console.error("No se pudieron leer las soluciones", error);
  }

  return <CategoriesBoard categories={categories} webUrl={process.env.PUBLIC_WEB_URL ?? ""} />;
}
