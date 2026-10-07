/** Mantiene la navegación post-login dentro del panel (evita open redirects). */
export function safePanelDestination(value: string | null): string {
  if (!value || value !== value.trim() || /[\\\x00-\x1f\x7f]/.test(value)) return "/panel";
  try {
    const base = "https://panel.invalid";
    const url = new URL(value, base);
    if (url.origin !== base || (url.pathname !== "/panel" && !url.pathname.startsWith("/panel/")) || url.hash) {
      return "/panel";
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return "/panel";
  }
}
