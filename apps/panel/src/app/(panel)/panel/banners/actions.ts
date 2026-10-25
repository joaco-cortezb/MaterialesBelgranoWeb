"use server";

import { revalidatePath } from "next/cache";
import { bannerSchema } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { revalidateWeb } from "@/lib/revalidate";
import { assertConfigured, assertMutationAllowed, fail, firstIssue, ok, type ActionResult } from "@/lib/actions";

export async function saveBanner(formData: FormData): Promise<ActionResult> {
  const configured = assertConfigured();
  if (configured) return configured;
  const limited = await assertMutationAllowed("inicio");
  if (limited) return limited;
  await requireSection("inicio");

  const parsed = bannerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { key, title, text, image, url, active } = parsed.data;
  const data = { title, text, image, url, active: active === "on" };

  try {
    await prisma.banner.upsert({ where: { key }, create: { key, ...data }, update: data });
  } catch (error) {
    console.error("No se pudo guardar el banner", error);
    return fail("No se pudo guardar el banner.");
  }

  await revalidateWeb("images");
  revalidatePath("/panel/banners");
  return ok(data.active ? "Banner guardado." : "Banner guardado y oculto en la web.");
}
