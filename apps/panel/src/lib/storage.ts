import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { env, supabaseAdminConfigured } from "@/lib/env";
import { optimizeUploadFile } from "@/lib/media-optimizer";
import { InvalidUploadError } from "@/lib/upload-validation";
import type { UploadFolder } from "@/lib/upload-limits";

/**
 * Cachear para siempre es seguro: cada archivo va a `carpeta/<uuid>.webp`,
 * así que un archivo distinto es siempre una URL distinta.
 */
const STORAGE_CACHE_CONTROL = "31536000, immutable";

/** Sube una imagen optimizada al bucket público. Devuelve la URL pública. */
export async function uploadToStorage(
  file: File,
  folder: UploadFolder,
): Promise<{ ok: true; url: string } | { ok: false; error: string; invalid?: boolean }> {
  if (!supabaseAdminConfigured()) {
    return { ok: false, error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY para subir archivos." };
  }

  try {
    const supabase = createAdminClient();
    const optimized = await optimizeUploadFile(file, folder);
    const storagePath = `${folder}/${crypto.randomUUID()}.${optimized.extension}`;

    const { error } = await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).upload(storagePath, optimized.data, {
      contentType: optimized.contentType,
      cacheControl: STORAGE_CACHE_CONTROL,
      upsert: false,
    });
    if (error) return { ok: false, error: error.message };

    const {
      data: { publicUrl },
    } = supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(storagePath);
    return { ok: true, url: publicUrl };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error desconocido al subir el archivo.",
      invalid: error instanceof InvalidUploadError,
    };
  }
}
