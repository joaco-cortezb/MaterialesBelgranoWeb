/** Sólo URLs https absolutas sin credenciales; el resto se descarta. */
export function safeExternalUrl(value: string): string | null {
  if (!value || value.length > 500 || value !== value.trim()) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

const YOUTUBE_HOSTS = ["www.youtube.com", "youtube.com", "m.youtube.com", "www.youtube-nocookie.com"];

/** ID de 11 caracteres de un link de YouTube, o `null` si no es un link válido. */
export function youtubeVideoId(value: string): string | null {
  const safe = safeExternalUrl(value);
  if (!safe) return null;
  const url = new URL(safe);
  let id: string | null = null;
  if (url.hostname === "youtu.be") {
    id = url.pathname.slice(1);
  } else if (YOUTUBE_HOSTS.includes(url.hostname)) {
    id =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : (url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)\/?$/)?.[1] ?? null);
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}
