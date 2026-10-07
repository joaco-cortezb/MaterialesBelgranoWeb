"use server";

import { revalidatePath } from "next/cache";
import { brandSchema, slugify } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { revalidateWeb } from "@/lib/revalidate";
import { assertConfigured, assertMutationAllowed, fail, firstIssue, ok, type ActionResult } from "@/lib/actions";

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
  await prisma.brand.delete({ where: { id } }).catch(() => {});
  return finish("Marca eliminada.");
}

export async function toggleBrandActive(id: string, active: boolean): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;
  await prisma.brand.update({ where: { id }, data: { active } });
  return finish();
}

export async function reorderBrand(id: string, dir: -1 | 1): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const items = await prisma.brand.findMany({ orderBy: { order: "asc" }, select: { id: true, order: true } });
  const index = items.findIndex((item) => item.id === id);
  const swap = index + dir;
  if (index < 0 || swap < 0 || swap >= items.length) return ok();

  await prisma.$transaction([
    prisma.brand.update({ where: { id: items[index].id }, data: { order: items[swap].order } }),
    prisma.brand.update({ where: { id: items[swap].id }, data: { order: items[index].order } }),
  ]);
  return finish();
}
