"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Role } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/auth";
import { env, supabaseAdminConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertConfigured, assertMutationAllowed, fail, firstIssue, ok, type ActionResult } from "@/lib/actions";

const PATH = "/panel/usuarios";
const CALLBACK_URL = `${env.PANEL_URL.replace(/\/$/, "")}/auth/callback`;

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido").max(180),
  fullName: z.string().trim().max(120).optional().default(""),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
});

async function guard(): Promise<ActionResult | null> {
  const configured = assertConfigured();
  if (configured) return configured;
  if (!supabaseAdminConfigured()) return fail("Falta SUPABASE_SERVICE_ROLE_KEY para administrar usuarios.");
  const limited = await assertMutationAllowed("usuarios");
  if (limited) return limited;
  await requireSection("usuarios");
  return null;
}

/** Busca un usuario de Auth por email (la API no tiene filtro: se pagina). */
async function findAuthUserByEmail(email: string) {
  const supabase = createAdminClient();
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const user = data.users.find((item) => item.email?.toLowerCase() === email);
    if (user) return user;
    if (data.users.length < 200) break;
  }
  return null;
}

/**
 * Invita por email: Supabase manda el link, el usuario cae en `/auth/callback`
 * (o en `/login` con el token en el hash) y elige su contraseña en `/reset`.
 * La fila en `Profile` se crea acá, porque sin ella el login lo rechaza.
 */
export async function inviteUser(formData: FormData): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { email, fullName, role } = parsed.data;

  try {
    const supabase = createAdminClient();
    let userId: string;
    const existing = await findAuthUserByEmail(email);

    if (existing) {
      userId = existing.id;
      // Ya tenía cuenta (por ejemplo, se le quitó el acceso antes): se le
      // manda un enlace de recuperación para que vuelva a entrar.
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: CALLBACK_URL });
      if (error) return fail(`No se pudo enviar el enlace: ${error.message}`);
    } else {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: CALLBACK_URL,
        data: fullName ? { full_name: fullName } : undefined,
      });
      if (error || !data.user) return fail(`No se pudo invitar: ${error?.message ?? "error desconocido"}`);
      userId = data.user.id;
    }

    await prisma.profile.upsert({
      where: { id: userId },
      create: { id: userId, email, fullName: fullName || null, role },
      update: { email, fullName: fullName || undefined, role },
    });
  } catch (error) {
    console.error("No se pudo invitar al usuario", error);
    return fail("No se pudo invitar al usuario.");
  }

  revalidatePath(PATH);
  return ok(`Invitación enviada a ${email}.`);
}

export async function resendAccess(id: string): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) return fail("El usuario no existe.");

  const { error } = await createAdminClient().auth.resetPasswordForEmail(profile.email, { redirectTo: CALLBACK_URL });
  if (error) return fail(`No se pudo enviar el enlace: ${error.message}`);
  return ok(`Enlace de acceso enviado a ${profile.email}.`);
}

export async function updateUserRole(id: string, role: Role): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;
  if (role !== "ADMIN" && role !== "EDITOR") return fail("Rol inválido.");

  const me = await requireSection("usuarios");
  if (me.id === id && role !== "ADMIN") return fail("No podés quitarte el rol de administrador a vos mismo.");

  await prisma.profile.update({ where: { id }, data: { role } });
  revalidatePath(PATH);
  return ok("Rol actualizado.");
}

/** Quita el acceso: borra el perfil y la cuenta de Auth (las sesiones caen al instante). */
export async function removeUser(id: string): Promise<ActionResult> {
  const blocked = await guard();
  if (blocked) return blocked;

  const me = await requireSection("usuarios");
  if (me.id === id) return fail("No podés quitarte el acceso a vos mismo.");

  const target = await prisma.profile.findUnique({ where: { id } });
  if (!target) return fail("El usuario no existe.");
  if (target.role === "ADMIN") {
    const admins = await prisma.profile.count({ where: { role: "ADMIN" } });
    if (admins <= 1) return fail("Tiene que quedar al menos un administrador.");
  }

  try {
    await prisma.profile.delete({ where: { id } });
    const { error } = await createAdminClient().auth.admin.deleteUser(id);
    if (error) console.error("No se pudo borrar la cuenta de Auth", error);
  } catch (error) {
    console.error("No se pudo quitar el acceso", error);
    return fail("No se pudo quitar el acceso.");
  }

  revalidatePath(PATH);
  return ok(`Se quitó el acceso a ${target.email}.`);
}
