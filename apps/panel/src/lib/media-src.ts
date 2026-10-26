/**
 * Las imágenes por defecto viven en la web (`/images/…`), no en el panel.
 * Para mostrarlas en las vistas previas se les antepone el dominio de la web.
 */
const WEB_URL = (process.env.NEXT_PUBLIC_WEB_URL ?? "").replace(/\/$/, "");

export function resolveMediaSrc(url: string): string {
  if (url.startsWith("/") && !url.startsWith("//")) return `${WEB_URL}${url}`;
  return url;
}
