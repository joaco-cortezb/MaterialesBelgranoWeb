"use server";

import { revalidatePath } from "next/cache";
import { imageSlotSchema } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { revalidateWeb } from "@/lib/revalidate";
import { assertConfigured, assertMutationAllowed, fail, firstIssue, ok, type ActionResult } from "@/lib/actions";

const PATH = "/panel/nosotros";

async function guard(): Promise<ActionResult | null> {
  const configured = assertConfigured();
  if (configured) return configured;
  const limited = await assertMutationAllowed("imagenes");
  if (limited) return limited;
  await requireSection("imagenes");
  return null;
}

export async function saveImageSlot(formData: FormData): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const parsed = imageSlotSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { key, url, alt, position } = parsed.data;

  let imageChanged = false;
  try {
    if (url) {
      const current = await prisma.imageSlot.findUnique({ where: { key }, select: { url: true } });
      imageChanged = current?.url !== url;
      await prisma.imageSlot.upsert({
        where: { key },
        create: { key, url, alt, position },
        update: { url, alt, position },
      });
    } else {
      // Sin URL vuelve a la imagen por defecto del repo.
      await prisma.imageSlot.deleteMany({ where: { key } });
    }
  } catch (error) {
    console.error("No se pudo guardar la imagen", error);
    return fail("No se pudo guardar la imagen.");
  }

  // Precalienta sólo si se cargó o cambió la foto (no al restaurar la del repo).
  revalidateWeb("images", { warm: imageChanged });
  revalidatePath(PATH);
  return ok(url ? "Imagen guardada." : "Se restauró la imagen por defecto.");
}
