"use server";

import { revalidatePath } from "next/cache";
import { brandSchema, slugify } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { revalidateWeb } from "@/lib/revalidate";
import { assertConfigured, assertMutationAllowed, attempt, fail, firstIssue, moveInList, ok, type ActionResult } from "@/lib/actions";

const PATH = "/panel/marcas";

async function guard(): Promise<ActionResult | null> {
  const configured = assertConfigured();
  if (configured) return configured;
  const limited = await assertMutationAllowed("marcas");
  if (limited) return limited;
  await requireSection("marcas");
  return null;
}

async function finish(message?: string): Promise<ActionResult> {
  await revalidateWeb("brands");
  revalidatePath(PATH);
  return ok(message);
}

export async function saveBrand(id: string, formData: FormData): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const parsed = brandSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const d = parsed.data;
  if (d.rubroSlug && !(await prisma.category.findUnique({ where: { slug: d.rubroSlug }, select: { id: true } }))) {
    return fail("La solución elegida no existe.");
  }
  const data = {
    name: d.name,
    catalogUrl: d.catalogUrl,
    logo: d.logo || null,
    rubroSlug: d.rubroSlug || null,
    active: d.active === "on",
  };

  try {
    if (id) {
      await prisma.brand.update({ where: { id }, data });
    } else {
      const base = slugify(d.name) || "marca";
      const taken = await prisma.brand.findUnique({ where: { slug: base }, select: { id: true } });
      const slug = taken ? `${base}-${Math.random().toString(36).slice(2, 6)}` : base;
      const last = await prisma.brand.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
      await prisma.brand.create({ data: { ...data, slug, order: (last?.order ?? -1) + 1 } });
    }
  } catch (error) {
    console.error("No se pudo guardar la marca", error);
    return fail("No se pudo guardar la marca.");
  }
  return finish("Marca guardada.");
}

export async function deleteBrand(id: string): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;
  const failed = await attempt(() => prisma.brand.delete({ where: { id } }), "No se pudo eliminar la marca.");
  if (failed) return failed;
  return finish("Marca eliminada.");
}

export async function toggleBrandActive(id: string, active: boolean): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;
  const failed = await attempt(() => prisma.brand.update({ where: { id }, data: { active } }), "No se pudo actualizar la marca.");
  if (failed) return failed;
  return finish();
}

export async function reorderBrand(id: string, dir: -1 | 1): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const items = await prisma.brand.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }], select: { id: true } });
  const ids = moveInList(items.map((item) => item.id), id, dir);
  if (!ids) return ok();
  const failed = await attempt(
    () => prisma.$transaction(ids.map((brandId, order) => prisma.brand.update({ where: { id: brandId }, data: { order } }))),
    "No se pudo cambiar el orden.",
  );
  if (failed) return failed;
  return finish();
}
