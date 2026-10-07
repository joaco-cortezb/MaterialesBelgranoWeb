import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { CMS_TAGS, ROUTES, RUBROS, type CmsTag } from "@mb/shared";
import { env, revalidateConfigured } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";

function isCmsTag(value: unknown): value is CmsTag {
  return typeof value === "string" && (CMS_TAGS as readonly string[]).includes(value);
}

const RUBRO_PATHS = RUBROS.map((rubro) => ROUTES.rubro(rubro.slug));

/** Qué páginas muestran cada tipo de contenido. */
const TAG_PATHS: Record<CmsTag, string[]> = {
  brands: [ROUTES.home, ROUTES.marcas, ...RUBRO_PATHS],
  images: [ROUTES.home, ROUTES.nosotros, ROUTES.servicios, ROUTES.rubros, ...RUBRO_PATHS],
  whatsapp: [ROUTES.contacto],
  settings: [ROUTES.home, ROUTES.nosotros],
};

export async function POST(request: Request) {
  const limited = await rateLimit({ key: `revalidate:${clientIp(request.headers)}`, limit: 30, windowMs: 60_000 });
  if (!limited.ok) {
    return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  if (!revalidateConfigured()) {
    return Response.json({ ok: false, error: "Revalidate secret is not configured" }, { status: 500 });
  }

  const authorization = request.headers.get("authorization");
  const bearer = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : undefined;
  const suppliedHash = createHash("sha256").update(bearer ?? "").digest();
  const expectedHash = createHash("sha256").update(env.REVALIDATE_SECRET).digest();
  if (!bearer || !timingSafeEqual(suppliedHash, expectedHash)) {
    console.warn(`[revalidate] unauthorized request from ${clientIp(request.headers)}`);
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > 1024) {
    return Response.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }
  let body: { tag?: unknown } | null = null;
  try {
    body = JSON.parse(rawBody) as { tag?: unknown };
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!isCmsTag(body?.tag)) {
    return Response.json({ ok: false, error: "Invalid tag" }, { status: 400 });
  }

  revalidateTag(body.tag, "max");
  for (const path of TAG_PATHS[body.tag]) revalidatePath(path);

  return Response.json({ ok: true, tag: body.tag, paths: TAG_PATHS[body.tag] });
}
