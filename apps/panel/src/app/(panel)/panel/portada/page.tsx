import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { HeroSlidesBoard, type HeroSlideDTO } from "./HeroSlidesBoard";

export const dynamic = "force-dynamic";

export default async function PortadaPage() {
  await requireSectionView("imagenes");

  let slides: HeroSlideDTO[] = [];
  try {
    slides = await prisma.heroSlide.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, url: true, alt: true, position: true, active: true },
    });
  } catch (error) {
    console.error("No se pudieron leer las fotos de la portada", error);
  }

  return <HeroSlidesBoard slides={slides} />;
}
