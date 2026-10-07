import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { safePanelDestination } from "@/lib/panel-destination";

/** Intercambia el `code`/`token_hash` de los enlaces de Supabase (invitación, recuperación) por una sesión. */
export async function GET(request: NextRequest) {
  const limited = await rateLimit({ key: `auth-callback:${clientIp(request.headers)}`, limit: 30, windowMs: 60_000 });
  if (!limited.ok) return NextResponse.redirect(new URL("/login?error=rate-limit", request.url));

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = safePanelDestination(searchParams.get("next"));

  if (supabaseConfigured()) {
    const supabase = await createClient();
    const authResult = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : tokenHash && isEmailOtpType(type)
        ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        : { error: new Error("Missing auth token") };

    if (!authResult.error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const existing = await prisma.profile.findUnique({ where: { id: user.id } });
        if (!existing) {
          await supabase.auth.signOut({ scope: "local" });
          return NextResponse.redirect(`${origin}/login?error=sin-acceso`);
        }
      }
      const destination = type === "invite" || type === "recovery" ? "/reset" : next;
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}

function isEmailOtpType(type: string | null): type is EmailOtpType {
  return type === "signup" || type === "invite" || type === "magiclink" || type === "recovery" || type === "email_change";
}
