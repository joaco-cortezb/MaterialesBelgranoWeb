"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { databaseConfigured, supabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

type SignInResult = { ok: true } | { ok: false; error: string };

const LOGIN_WINDOW_MS = 15 * 60_000;

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
  const emailHash = crypto.createHash("sha256").update(`email:${email}`).digest("hex");
  const ipHash = crypto.createHash("sha256").update(`ip:${ip}`).digest("hex");

  // Límite compartido entre instancias (en la base): 5 fallos por email y 10
  // por IP cada 15 minutos. El de memoria queda como primer filtro barato.
  const quick = await rateLimit({ key: `login:ip:${ip}`, limit: 20, windowMs: 15 * 60_000 });
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);
  const [byEmail, byIp] = quick.ok
    ? await Promise.all([
        prisma.loginAttempt.count({ where: { keyHash: emailHash, createdAt: { gte: since } } }),
        prisma.loginAttempt.count({ where: { keyHash: ipHash, createdAt: { gte: since } } }),
      ]).catch(() => [0, 0])
    : [Infinity, Infinity];
  if (byEmail >= 5 || byIp >= 10) {
    console.warn("Login limitado", { emailHash: emailHash.slice(0, 12) });
    return { ok: false, error: "Demasiados intentos. Esperá 15 minutos e intentá de nuevo." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    await prisma
      .$transaction([
        prisma.loginAttempt.createMany({ data: [{ keyHash: emailHash }, { keyHash: ipHash }] }),
        // Limpieza: los intentos de más de un día ya no sirven.
        prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60_000) } } }),
      ])
      .catch((dbError) => console.error("No se pudo registrar el intento de login", dbError));
    return genericError;
  }

  const profile = await prisma.profile.findUnique({ where: { id: data.user.id }, select: { id: true } });
  if (!profile) {
    await supabase.auth.signOut({ scope: "local" });
    return { ok: false, error: "Tu cuenta no tiene acceso al panel." };
  }
  return { ok: true };
}
