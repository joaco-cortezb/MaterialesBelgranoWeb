import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { BrandsBoard, type BrandDTO } from "./BrandsBoard";

export const dynamic = "force-dynamic";

export default async function MarcasPage() {
  await requireSectionView("marcas");

  let brands: BrandDTO[] = [];
  try {
    const rows = await prisma.brand.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, logo: true, catalogUrl: true, rubroSlug: true, active: true },
    });
    brands = rows.map((row) => ({ ...row, logo: row.logo ?? "", rubroSlug: row.rubroSlug ?? "" }));
  } catch (error) {
    console.error("No se pudieron leer las marcas", error);
  }

  return <BrandsBoard brands={brands} />;
}
