import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = await rateLimit({ key: `signout:${clientIp(request.headers)}`, limit: 30, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.redirect(new URL("/login?error=rate-limit", request.url), { status: 303 });
  }
  if (supabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  const response = NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}
