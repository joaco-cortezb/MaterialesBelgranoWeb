import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, supabaseConfigured } from "@/lib/env";

/** Rutas públicas (no requieren sesión). */
const PUBLIC_PATHS = ["/login", "/reset", "/auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Refresca la sesión de Supabase en cada request y protege el panel.
 * Se invoca desde `proxy.ts`.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Sin credenciales reales dejamos pasar para que el proyecto compile y arranque.
  if (!supabaseConfigured()) return supabaseResponse;

  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPanelPath = pathname.startsWith("/panel") || pathname === "/";
  const isApi = pathname.startsWith("/api/");

  if (!user && !isPublicPath(pathname)) {
    if (isApi) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return privatePanelResponse(NextResponse.redirect(url), true);
  }

  if (user && pathname === "/login") {
    const redirected = NextResponse.redirect(new URL("/panel", request.url));
    for (const cookie of supabaseResponse.cookies.getAll()) redirected.cookies.set(cookie);
    return privatePanelResponse(redirected, true);
  }

  return privatePanelResponse(supabaseResponse, isPanelPath);
}

function privatePanelResponse(response: NextResponse, isPanelPath: boolean): NextResponse {
  if (!isPanelPath) return response;
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}
