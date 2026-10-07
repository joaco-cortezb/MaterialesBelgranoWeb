import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { ImageSlotsBoard, type SlotValue } from "./ImageSlotsBoard";

export const dynamic = "force-dynamic";

export default async function ImagenesPage() {
  await requireSectionView("imagenes");

  let values: Record<string, SlotValue> = {};
  try {
    const rows = await prisma.imageSlot.findMany({ select: { key: true, url: true, alt: true, position: true } });
    values = Object.fromEntries(rows.map((row) => [row.key, { url: row.url, alt: row.alt, position: row.position ?? "50% 50%" }]));
  } catch (error) {
    console.error("No se pudieron leer las imágenes", error);
  }

  return <ImageSlotsBoard values={values} />;
}
