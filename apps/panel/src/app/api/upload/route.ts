import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { assertConfigured } from "@/lib/actions";
import { requireProfile } from "@/lib/auth";
import { canManageSection } from "@/lib/permissions";
import { uploadToStorage } from "@/lib/storage";
import { FUNCTION_UPLOAD_LIMIT_BYTES, isAllowedUploadFile, MAX_FUNCTION_UPLOAD_MB, UPLOAD_MANAGE_SECTION } from "@/lib/upload-limits";

const folderSchema = z.enum(["brands", "slots"]);

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const guard = assertConfigured();
  if (guard) return NextResponse.json(guard, { status: 503 });

  const profile = await requireProfile();
  const formData = await request.formData();
  const folder = folderSchema.safeParse(formData.get("folder"));
  if (!folder.success) {
    return NextResponse.json({ ok: false, error: "Carpeta de subida inválida." }, { status: 400 });
  }
  if (!canManageSection(profile.role, UPLOAD_MANAGE_SECTION[folder.data])) {
    return NextResponse.json({ ok: false, error: "Sin permiso para esta carpeta." }, { status: 403 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "No se recibió ningún archivo." }, { status: 400 });
  }
  if (file.size > FUNCTION_UPLOAD_LIMIT_BYTES) {
    return NextResponse.json({ ok: false, error: `El archivo supera los ${MAX_FUNCTION_UPLOAD_MB} MB.` }, { status: 400 });
  }
  // Se valida también acá: el `accept` del input es una sugerencia que
  // cualquiera puede saltear posteando directo al endpoint.
  if (!isAllowedUploadFile(file.name, file.type)) {
    return NextResponse.json({ ok: false, error: "Formato de archivo no permitido." }, { status: 400 });
  }

  const result = await uploadToStorage(file, folder.data);
  return NextResponse.json(result, { status: result.ok ? 200 : result.invalid ? 400 : 500 });
}
