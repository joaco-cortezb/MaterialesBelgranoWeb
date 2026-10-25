import { BANNER_CONFIG, BANNER_KEYS } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { BannersBoard, type BannerDTO } from "./BannersBoard";

export const dynamic = "force-dynamic";

export default async function BannersPage() {
  await requireSectionView("inicio");

  let rows: { key: string; title: string; text: string; image: string; url: string; active: boolean }[] = [];
  try {
    rows = await prisma.banner.findMany();
  } catch (error) {
    console.error("No se pudieron leer los banners", error);
  }

  // Sin fila cargada, el formulario arranca con lo que hoy muestra la web.
  const banners: BannerDTO[] = BANNER_KEYS.map((key) => {
    const row = rows.find((item) => item.key === key);
    return row
      ? { key, title: row.title, text: row.text, image: row.image, url: row.url, active: row.active, saved: true }
      : { key, ...BANNER_CONFIG[key].defaults, active: true, saved: false };
  });

  return <BannersBoard banners={banners} />;
}
