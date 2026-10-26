"use server";

import { revalidatePath } from "next/cache";
import { whatsappNumberSchema, type WhatsappAudience } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { revalidateWeb } from "@/lib/revalidate";
import { assertConfigured, assertMutationAllowed, fail, firstIssue, ok, type ActionResult } from "@/lib/actions";

/**
 * La web usa a lo sumo dos números: Ventas (GENERAL, el de todos los botones)
 * y Mayoristas (EMPRESAS, sólo en Contacto). Cada uno se guarda en su lugar.
 */
export async function saveWhatsappSlot(audience: WhatsappAudience, formData: FormData): Promise<ActionResult> {
  const configured = assertConfigured();
  if (configured) return configured;
  const limited = await assertMutationAllowed("whatsapp");
  if (limited) return limited;
  await requireSection("whatsapp");

  if (audience !== "GENERAL" && audience !== "EMPRESAS") return fail("Número inválido.");
  const parsed = whatsappNumberSchema.safeParse({ ...Object.fromEntries(formData), audience });
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const d = parsed.data;
  // Ventas siempre queda visible: es el número de todos los botones de la web.
  const data = { label: d.label, phone: d.phone, message: d.message, audience, active: audience === "GENERAL" ? true : d.active === "on" };

  try {
    // Se edita el número activo de ese tipo (el que usa la web); si quedaran
    // otros viejos del mismo tipo, se apagan para que Contacto muestre sólo dos.
    const existing = await prisma.whatsappNumber.findFirst({
      where: { audience },
      orderBy: [{ active: "desc" }, { order: "asc" }],
      select: { id: true },
    });
    if (existing) {
      await prisma.$transaction([
        prisma.whatsappNumber.update({ where: { id: existing.id }, data }),
        prisma.whatsappNumber.updateMany({ where: { audience, id: { not: existing.id } }, data: { active: false } }),
      ]);
    } else {
      await prisma.whatsappNumber.create({ data: { ...data, order: audience === "GENERAL" ? 0 : 1 } });
    }
  } catch (error) {
    console.error("No se pudo guardar el número", error);
    return fail("No se pudo guardar el número.");
  }

  await revalidateWeb("whatsapp");
  revalidatePath("/panel/nosotros");
  return ok(audience === "GENERAL" ? "Número de ventas guardado." : "Número de mayoristas guardado.");
}
