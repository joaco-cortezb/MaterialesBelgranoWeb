import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { canManageSection } from "@/lib/permissions";
import { WhatsappBoard, type WhatsappDTO } from "./WhatsappBoard";

export const dynamic = "force-dynamic";

export default async function WhatsappPage() {
  const profile = await requireSectionView("whatsapp");

  let numbers: WhatsappDTO[] = [];
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const [rows, clicks] = await Promise.all([
      prisma.whatsappNumber.findMany({
        orderBy: { order: "asc" },
        select: { id: true, label: true, phone: true, message: true, audience: true, active: true },
      }),
      prisma.whatsappClick.groupBy({ by: ["numberId"], where: { createdAt: { gte: since } }, _count: { _all: true } }),
    ]);
    const clicksByNumber = new Map(clicks.map((row) => [row.numberId, row._count._all]));
    numbers = rows.map((row) => ({ ...row, clicks30: clicksByNumber.get(row.id) ?? 0 }));
  } catch (error) {
    console.error("No se pudieron leer los números", error);
  }

  return <WhatsappBoard numbers={numbers} canManage={canManageSection(profile.role, "whatsapp")} />;
}
