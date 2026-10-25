"use server";

import { revalidatePath } from "next/cache";
import { HERO_MAX_SLIDES, heroSlideSchema, heroTextSchema, isHeroPage, SETTING_KEYS } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { revalidateWeb } from "@/lib/revalidate";
import { assertConfigured, assertMutationAllowed, fail, firstIssue, ok, type ActionResult } from "@/lib/actions";

const PATH = "/panel/portada";

/** Las fotos de la portada se manejan con el permiso de "Imágenes". */
async function guard(): Promise<ActionResult | null> {
  const configured = assertConfigured();
  if (configured) return configured;
  const limited = await assertMutationAllowed("imagenes");
  if (limited) return limited;
  await requireSection("imagenes");
  return null;
}

async function finish(message?: string): Promise<ActionResult> {
  await revalidateWeb("images");
  revalidatePath(PATH);
  return ok(message);
}

export async function saveHeroSlide(id: string, formData: FormData): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const parsed = heroSlideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const data = parsed.data;

  try {
    if (id) {
      // La página de una foto no cambia al editarla.
      await prisma.heroSlide.update({ where: { id }, data: { url: data.url, alt: data.alt, position: data.position } });
    } else {
      const count = await prisma.heroSlide.count({ where: { page: data.page } });
      if (count >= HERO_MAX_SLIDES) return fail(`Cada portada admite hasta ${HERO_MAX_SLIDES} fotos.`);
      const last = await prisma.heroSlide.findFirst({ where: { page: data.page }, orderBy: { order: "desc" }, select: { order: true } });
      await prisma.heroSlide.create({ data: { ...data, order: (last?.order ?? -1) + 1 } });
    }
  } catch (error) {
    console.error("No se pudo guardar la foto de portada", error);
    return fail("No se pudo guardar la foto.");
  }
  return finish(id ? "Foto actualizada." : "Foto agregada a la portada.");
}

export async function deleteHeroSlide(id: string): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;
  await prisma.heroSlide.delete({ where: { id } }).catch(() => {});
  return finish("Foto eliminada.");
}

export async function toggleHeroSlideActive(id: string, active: boolean): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    await prisma.heroSlide.update({ where: { id }, data: { active } });
  } catch {
    return fail("No se pudo actualizar la foto.");
  }
  return finish(active ? "Foto visible en la portada." : "Foto oculta.");
}

export async function reorderHeroSlide(id: string, dir: -1 | 1): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const slide = await prisma.heroSlide.findUnique({ where: { id }, select: { page: true } });
  if (!slide || !isHeroPage(slide.page)) return ok();
  const items = await prisma.heroSlide.findMany({ where: { page: slide.page }, orderBy: [{ order: "asc" }, { createdAt: "asc" }], select: { id: true } });
  const index = items.findIndex((item) => item.id === id);
  const swap = index + dir;
  if (index < 0 || swap < 0 || swap >= items.length) return ok();

  // Renumera todo: así dos fotos con el mismo `order` no quedan trabadas.
  const ids = items.map((item) => item.id);
  [ids[index], ids[swap]] = [ids[swap], ids[index]];
  await prisma.$transaction(ids.map((slideId, order) => prisma.heroSlide.update({ where: { id: slideId }, data: { order } })));
  return finish();
}

/** Título y bajada de la portada del inicio (vacío = texto por defecto / sin bajada). */
export async function saveHomeHeroText(formData: FormData): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const parsed = heroTextSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));

  try {
    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: SETTING_KEYS.homeHeroTitle },
        create: { key: SETTING_KEYS.homeHeroTitle, value: parsed.data.title },
        update: { value: parsed.data.title },
      }),
      prisma.setting.upsert({
        where: { key: SETTING_KEYS.homeHeroText },
        create: { key: SETTING_KEYS.homeHeroText, value: parsed.data.text },
        update: { value: parsed.data.text },
      }),
    ]);
  } catch (error) {
    console.error("No se pudo guardar el texto de la portada", error);
    return fail("No se pudo guardar el texto.");
  }
  await revalidateWeb("settings");
  revalidatePath(PATH);
  return ok("Texto de la portada guardado.");
}
