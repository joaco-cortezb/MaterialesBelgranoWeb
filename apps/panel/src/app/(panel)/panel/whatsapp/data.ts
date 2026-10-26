import "server-only";

import { SITE } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import type { WhatsappSlotDTO } from "./WhatsappBoard";

const EMPTY_SLOTS: Record<"GENERAL" | "EMPRESAS", WhatsappSlotDTO> = {
  GENERAL: { id: "", label: "Ventas", phone: SITE.whatsappFallback.phone, message: "", active: true, clicks30: 0, saved: false },
  EMPRESAS: { id: "", label: "Mayoristas", phone: "", message: "", active: false, clicks30: 0, saved: false },
};

/** Los dos números de la web (Ventas y Mayoristas), con sus clics de 30 días. */
export async function loadWhatsappSlots(): Promise<Record<"GENERAL" | "EMPRESAS", WhatsappSlotDTO>> {
  const slots = { ...EMPTY_SLOTS };

  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const [rows, clicks] = await Promise.all([
      prisma.whatsappNumber.findMany({ orderBy: [{ active: "desc" }, { order: "asc" }] }),
      prisma.whatsappClick.groupBy({ by: ["numberId"], where: { createdAt: { gte: since } }, _count: { _all: true } }),
    ]);
    const clicksByNumber = new Map(clicks.map((row) => [row.numberId, row._count._all]));
    for (const audience of ["GENERAL", "EMPRESAS"] as const) {
      const row = rows.find((item) => item.audience === audience);
      if (row) {
        slots[audience] = {
          id: row.id,
          label: row.label,
          phone: row.phone,
          message: row.message,
          active: row.active,
          clicks30: clicksByNumber.get(row.id) ?? 0,
          saved: true,
        };
      }
    }
  } catch (error) {
    console.error("No se pudieron leer los números", error);
  }

  return slots;
}
