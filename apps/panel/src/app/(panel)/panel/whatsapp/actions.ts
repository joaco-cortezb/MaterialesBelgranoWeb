"use server";

import { revalidatePath } from "next/cache";
import { whatsappNumberSchema } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { revalidateWeb } from "@/lib/revalidate";
import { assertConfigured, assertMutationAllowed, fail, firstIssue, ok, type ActionResult } from "@/lib/actions";

const PATH = "/panel/whatsapp";

async function guard(): Promise<ActionResult | null> {
  const configured = assertConfigured();
  if (configured) return configured;
  const limited = await assertMutationAllowed("whatsapp");
  if (limited) return limited;
  await requireSection("whatsapp");
  return null;
}

async function finish(message?: string): Promise<ActionResult> {
  await revalidateWeb("whatsapp");
  revalidatePath(PATH);
  return ok(message);
}

export async function saveWhatsappNumber(id: string, formData: FormData): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const parsed = whatsappNumberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const d = parsed.data;
  const data = { label: d.label, phone: d.phone, message: d.message, audience: d.audience, active: d.active === "on" };

  try {
    if (id) {
      await prisma.whatsappNumber.update({ where: { id }, data });
    } else {
      const last = await prisma.whatsappNumber.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
      await prisma.whatsappNumber.create({ data: { ...data, order: (last?.order ?? -1) + 1 } });
    }
  } catch (error) {
    console.error("No se pudo guardar el número", error);
    return fail("No se pudo guardar el número.");
  }
  return finish("Número guardado.");
}

export async function deleteWhatsappNumber(id: string): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;
  await prisma.whatsappNumber.delete({ where: { id } }).catch(() => {});
  return finish("Número eliminado.");
}

export async function toggleWhatsappActive(id: string, active: boolean): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;
  await prisma.whatsappNumber.update({ where: { id }, data: { active } });
  return finish();
}

export async function reorderWhatsappNumber(id: string, dir: -1 | 1): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const items = await prisma.whatsappNumber.findMany({ orderBy: { order: "asc" }, select: { id: true, order: true } });
  const index = items.findIndex((item) => item.id === id);
  const swap = index + dir;
  if (index < 0 || swap < 0 || swap >= items.length) return ok();

  await prisma.$transaction([
    prisma.whatsappNumber.update({ where: { id: items[index].id }, data: { order: items[swap].order } }),
    prisma.whatsappNumber.update({ where: { id: items[swap].id }, data: { order: items[index].order } }),
  ]);
  return finish();
}
