import { SETTING_KEYS } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { HomeVideoForm } from "./HomeVideoForm";

export const dynamic = "force-dynamic";

export default async function InicioPage() {
  await requireSectionView("inicio");

  let videoUrl = "";
  try {
    const setting = await prisma.setting.findUnique({ where: { key: SETTING_KEYS.homeVideoUrl } });
    if (typeof setting?.value === "string") videoUrl = setting.value;
  } catch (error) {
    console.error("No se pudo leer el video", error);
  }

  return <HomeVideoForm initialUrl={videoUrl} />;
}
