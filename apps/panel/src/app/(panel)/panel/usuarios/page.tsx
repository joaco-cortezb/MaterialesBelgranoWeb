import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/env";
import { UsersBoard, type UserDTO } from "./UsersBoard";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const me = await requireSectionView("usuarios");

  let users: UserDTO[] = [];
  try {
    const profiles = await prisma.profile.findMany({ orderBy: { createdAt: "asc" } });

    // Último ingreso y si ya aceptó la invitación: sale de Auth, no de la base.
    const lastSignIn = new Map<string, string | null>();
    const confirmed = new Set<string>();
    if (supabaseAdminConfigured()) {
      const { data } = await createAdminClient().auth.admin.listUsers({ perPage: 200 });
      for (const user of data?.users ?? []) {
        lastSignIn.set(user.id, user.last_sign_in_at ?? null);
        if (user.email_confirmed_at) confirmed.add(user.id);
      }
    }

    users = profiles.map((profile) => ({
      id: profile.id,
      email: profile.email,
      fullName: profile.fullName ?? "",
      role: profile.role,
      createdAt: profile.createdAt.toISOString(),
      lastSignInAt: lastSignIn.get(profile.id) ?? null,
      pending: !confirmed.has(profile.id),
    }));
  } catch (error) {
    console.error("No se pudieron leer los usuarios", error);
  }

  return <UsersBoard users={users} currentUserId={me.id} />;
}
