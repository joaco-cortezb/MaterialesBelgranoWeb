"use server";

import { revalidatePath } from "next/cache";
import { aboutSchema, SETTING_KEYS } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { revalidateWeb } from "@/lib/revalidate";
import { assertConfigured, assertMutationAllowed, fail, firstIssue, ok, type ActionResult } from "@/lib/actions";

export async function saveAbout(formData: FormData): Promise<ActionResult> {
  const configured = assertConfigured();
  if (configured) return configured;
  const limited = await assertMutationAllowed("nosotros");
  if (limited) return limited;
  await requireSection("nosotros");

  const parsed = aboutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { headline, body } = parsed.data;

  try {
    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: SETTING_KEYS.aboutHeadline },
        create: { key: SETTING_KEYS.aboutHeadline, value: headline },
        update: { value: headline },
      }),
      prisma.setting.upsert({
        where: { key: SETTING_KEYS.aboutBody },
        create: { key: SETTING_KEYS.aboutBody, value: body },
        update: { value: body },
      }),
    ]);
  } catch (error) {
    console.error("No se pudo guardar el texto de Nosotros", error);
    return fail("No se pudo guardar el texto.");
  }

  await revalidateWeb("settings");
  revalidatePath("/panel/nosotros");
  return ok("Texto guardado.");
}
