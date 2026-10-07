"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { databaseConfigured, supabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

type SignInResult = { ok: true } | { ok: false; error: string };

/**
 * Login con email y contraseña. Siempre el mismo error genérico (no revela
 * si el email existe), rate limit por IP y por email, y exige fila en
 * `Profile`: el acceso al panel es por invitación.
 */
export async function signInWithPassword(formData: FormData): Promise<SignInResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = formData.get("password");
  const genericError: SignInResult = { ok: false, error: "Email o contraseña incorrectos." };

  if (!supabaseConfigured() || !databaseConfigured() || !email || email.length > 180 || typeof password !== "string") {
    return genericError;
  }

  const ip = clientIp(await headers());
  const emailHash = crypto.createHash("sha256").update(email).digest("hex");
  const [byIp, byEmail] = await Promise.all([
    rateLimit({ key: `login:ip:${ip}`, limit: 10, windowMs: 15 * 60_000 }),
    rateLimit({ key: `login:email:${emailHash}`, limit: 5, windowMs: 15 * 60_000 }),
  ]);
  if (!byIp.ok || !byEmail.ok) {
    console.warn("Login limitado", { ip, emailHash });
    return { ok: false, error: "Demasiados intentos. Esperá 15 minutos e intentá de nuevo." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return genericError;

  const profile = await prisma.profile.findUnique({ where: { id: data.user.id }, select: { id: true } });
  if (!profile) {
    await supabase.auth.signOut({ scope: "local" });
    return { ok: false, error: "Tu cuenta no tiene acceso al panel." };
  }
  return { ok: true };
}
