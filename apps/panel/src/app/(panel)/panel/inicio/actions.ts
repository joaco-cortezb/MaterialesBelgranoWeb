"use server";

import { revalidatePath } from "next/cache";
import { homeVideoSchema, SETTING_KEYS } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { revalidateWeb } from "@/lib/revalidate";
import { assertConfigured, assertMutationAllowed, fail, firstIssue, ok, type ActionResult } from "@/lib/actions";

export async function saveHomeVideo(formData: FormData): Promise<ActionResult> {
  const configured = assertConfigured();
  if (configured) return configured;
  const limited = await assertMutationAllowed("inicio");
  if (limited) return limited;
  await requireSection("inicio");

  const parsed = homeVideoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));

  try {
    await prisma.setting.upsert({
      where: { key: SETTING_KEYS.homeVideoUrl },
      create: { key: SETTING_KEYS.homeVideoUrl, value: parsed.data.videoUrl },
      update: { value: parsed.data.videoUrl },
    });
  } catch (error) {
    console.error("No se pudo guardar el video", error);
    return fail("No se pudo guardar el video.");
  }

  await revalidateWeb("settings");
  revalidatePath("/panel/inicio");
  return ok(parsed.data.videoUrl ? "Video guardado." : "Video quitado del inicio.");
}
