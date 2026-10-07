import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { supabaseConfigured } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { canManageSection, canViewSection, type PanelSection } from "@/lib/permissions";
import type { Profile } from "@/generated/prisma";

/** Exige sesión; si no hay, manda al login. */
export async function requireUser(): Promise<User> {
  if (!supabaseConfigured()) redirect("/login");
  const requestHeaders = await headers();
  const limited = await rateLimit({
    key: `panel-authenticated:${clientIp(requestHeaders)}`,
    limit: 600,
    windowMs: 60_000,
  });
  if (!limited.ok) redirect("/login?error=rate-limit");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}

/** Sólo quien tiene fila en `Profile` entra: el acceso es por invitación. */
export async function requireProfile(): Promise<Profile> {
  const user = await requireUser();
  const existing = await prisma.profile.findUnique({ where: { id: user.id } });
  if (existing) return existing;

  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/login?error=sin-acceso");
}

/** Exige poder ABRIR una sección (para gatear páginas). */
export async function requireSectionView(section: PanelSection): Promise<Profile> {
  const profile = await requireProfile();
  if (!canViewSection(profile.role, section)) redirect("/panel?error=forbidden");
  return profile;
}

/** Exige poder EDITAR una sección (para gatear server actions). */
export async function requireSection(section: PanelSection): Promise<Profile> {
  const profile = await requireProfile();
  if (!canManageSection(profile.role, section)) redirect("/panel?error=forbidden");
  return profile;
}
