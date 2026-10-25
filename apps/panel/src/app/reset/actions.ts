"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validatePassword } from "@/lib/password-policy";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Cambio de contraseña (invitación o recuperación). Se hace en el servidor
 * para que la política no dependa del navegador.
 */
export async function updatePassword(formData: FormData): Promise<Result> {
  if (!supabaseConfigured()) return { ok: false, error: "El panel no está configurado." };

  const limited = await rateLimit({ key: `reset:${clientIp(await headers())}`, limit: 10, windowMs: 15 * 60_000 });
  if (!limited.ok) return { ok: false, error: "Demasiados intentos. Esperá unos minutos." };

  const password = formData.get("password");
  const confirm = formData.get("confirm");
  if (typeof password !== "string" || typeof confirm !== "string") return { ok: false, error: "Datos inválidos." };
  if (password !== confirm) return { ok: false, error: "Las contraseñas no coinciden." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "El enlace venció. Pedí uno nuevo." };

  const invalid = await validatePassword(password, user.email);
  if (invalid) return { ok: false, error: invalid };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: "No se pudo guardar la contraseña. Pedí un enlace nuevo." };
  return { ok: true };
}
