"use server";

import { revalidatePath } from "next/cache";
import { categorySchema } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { revalidateWeb } from "@/lib/revalidate";
import { assertConfigured, assertMutationAllowed, attempt, fail, firstIssue, moveInList, ok, type ActionResult } from "@/lib/actions";

const PATH = "/panel/soluciones";

async function guard(): Promise<ActionResult | null> {
  const configured = assertConfigured();
  if (configured) return configured;
  const limited = await assertMutationAllowed("soluciones");
  if (limited) return limited;
  await requireSection("soluciones");
  return null;
}

async function finish(message?: string, alsoBrands = false): Promise<ActionResult> {
  await revalidateWeb("categories");
  if (alsoBrands) await revalidateWeb("brands");
  revalidatePath(PATH);
  return ok(message);
}

export async function saveCategory(id: string, formData: FormData): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const d = parsed.data;

  const taken = await prisma.category.findUnique({ where: { slug: d.slug }, select: { id: true } });
  if (taken && taken.id !== id) return fail("Ya hay otra solución con esa URL.");

  const data = {
    name: d.name,
    slug: d.slug,
    summary: d.summary,
    description: d.description,
    subcategories: d.subcategories,
    faqs: d.faqs,
    image: d.image || null,
    imageAlt: d.imageAlt || null,
    imagePosition: d.imagePosition,
    whatsappMessage: d.whatsappMessage,
    seoTitle: d.seoTitle || null,
    seoDescription: d.seoDescription || null,
    active: d.active === "on",
  };

  let slugChanged = false;
  try {
    if (id) {
      const current = await prisma.category.findUnique({ where: { id }, select: { slug: true } });
      if (!current) return fail("La solución no existe.");
      slugChanged = current.slug !== d.slug;
      await prisma.$transaction([
        prisma.category.update({ where: { id }, data }),
        // Las marcas quedan asociadas aunque cambie la URL.
        ...(slugChanged ? [prisma.brand.updateMany({ where: { rubroSlug: current.slug }, data: { rubroSlug: d.slug } })] : []),
      ]);
    } else {
      const last = await prisma.category.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
      await prisma.category.create({ data: { ...data, order: (last?.order ?? -1) + 1 } });
    }
  } catch (error) {
    console.error("No se pudo guardar la solución", error);
    return fail("No se pudo guardar la solución.");
  }
  return finish("Solución guardada.", slugChanged);
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;
  const current = await prisma.category.findUnique({ where: { id }, select: { slug: true } });
  if (!current) return ok();
  const failed = await attempt(
    () =>
      prisma.$transaction([
        prisma.brand.updateMany({ where: { rubroSlug: current.slug }, data: { rubroSlug: null } }),
        prisma.category.delete({ where: { id } }),
      ]),
    "No se pudo eliminar la solución.",
  );
  if (failed) return failed;
  return finish("Solución eliminada.", true);
}

export async function toggleCategoryActive(id: string, active: boolean): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;
  const failed = await attempt(() => prisma.category.update({ where: { id }, data: { active } }), "No se pudo actualizar la solución.");
  if (failed) return failed;
  return finish();
}

export async function reorderCategory(id: string, dir: -1 | 1): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const items = await prisma.category.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }], select: { id: true } });
  const ids = moveInList(items.map((item) => item.id), id, dir);
  if (!ids) return ok();
  const failed = await attempt(
    () => prisma.$transaction(ids.map((categoryId, order) => prisma.category.update({ where: { id: categoryId }, data: { order } }))),
    "No se pudo cambiar el orden.",
  );
  if (failed) return failed;
  return finish();
}
