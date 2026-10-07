/** Deja sólo dígitos: "+54 9 261 533-0777" → "5492615330777". */
export function normalizeWhatsappPhone(value: string): string {
  return value.replace(/\D/g, "");
}

/** Link `wa.me` con el mensaje precargado (vacío = sin `text`). */
export function whatsappUrl(phone: string, message?: string): string {
  const digits = normalizeWhatsappPhone(phone);
  const url = new URL(`https://wa.me/${digits}`);
  if (message?.trim()) url.searchParams.set("text", message.trim());
  return url.toString();
}

/** "5492615330777" → "+54 9 261 533-0777" para mostrar. Si no es AR, devuelve con `+`. */
export function formatWhatsappPhone(phone: string): string {
  const digits = normalizeWhatsappPhone(phone);
  const ar = /^549(\d{3})(\d{3})(\d{4})$/.exec(digits);
  if (ar) return `+54 9 ${ar[1]} ${ar[2]}-${ar[3]}`;
  return `+${digits}`;
}

/**
 * Mensaje final: el precargado del número + de qué página viene. Así el
 * vendedor sabe de dónde llega la consulta sin que el cliente escriba nada.
 */
export function composeWhatsappMessage(base: string, pageLabel?: string): string {
  const trimmed = base.trim();
  if (!pageLabel) return trimmed;
  return trimmed ? `${trimmed} (${pageLabel})` : `Hola, vengo de la web de Materiales Belgrano (${pageLabel}).`;
}
