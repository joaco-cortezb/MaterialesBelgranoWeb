import "server-only";

import { createHash } from "node:crypto";

/**
 * Política de contraseñas del panel, aplicada en el servidor (el `minLength`
 * del formulario es sólo una ayuda). Reemplaza la "Leaked password
 * protection" de Supabase, que es del plan Pro: consulta HaveIBeenPwned con
 * k-anonymity (sólo viajan los primeros 5 caracteres del SHA-1, nunca la
 * contraseña ni el hash completo).
 */
export const PASSWORD_MIN_LENGTH = 10;
/** bcrypt (lo que usa Supabase Auth) ignora lo que pase de 72 bytes. */
const PASSWORD_MAX_BYTES = 72;

export async function validatePassword(password: string, email?: string): Promise<string | null> {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña tiene que tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES) {
    return "La contraseña es demasiado larga (máximo 72 caracteres).";
  }
  if (new Set(password).size < 4) {
    return "La contraseña es demasiado simple: usá más variedad de caracteres.";
  }
  const localPart = email?.split("@")[0]?.toLowerCase();
  if (localPart && localPart.length >= 4 && password.toLowerCase().includes(localPart)) {
    return "La contraseña no puede contener tu email.";
  }
  if (await isPwned(password)) {
    return "Esa contraseña apareció en filtraciones públicas. Elegí otra.";
  }
  return null;
}

/**
 * `true` si la contraseña figura en HaveIBeenPwned. Si el servicio no
 * responde, no bloquea el cambio (falla abierta) pero lo deja en el log.
 */
async function isPwned(password: string): Promise<boolean> {
  const hash = createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true", "User-Agent": "materiales-belgrano-panel" },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.text();
    return body.split("\n").some((line) => {
      const [candidate, count] = line.trim().split(":");
      return candidate === suffix && Number(count) > 0;
    });
  } catch (error) {
    console.warn("[password-policy] HaveIBeenPwned no respondió; se omite el chequeo", error);
    return false;
  }
}
