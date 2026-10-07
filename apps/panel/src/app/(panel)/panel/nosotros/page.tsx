import { SETTING_KEYS } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { AboutForm } from "./AboutForm";

export const dynamic = "force-dynamic";

export default async function NosotrosPage() {
  await requireSectionView("nosotros");

  let headline = "";
  let body = "";
  try {
    const rows = await prisma.setting.findMany({ where: { key: { in: [SETTING_KEYS.aboutHeadline, SETTING_KEYS.aboutBody] } } });
    for (const row of rows) {
      if (row.key === SETTING_KEYS.aboutHeadline && typeof row.value === "string") headline = row.value;
      if (row.key === SETTING_KEYS.aboutBody && typeof row.value === "string") body = row.value;
    }
  } catch (error) {
    console.error("No se pudo leer el texto de Nosotros", error);
  }

  return <AboutForm initialHeadline={headline} initialBody={body} />;
}
