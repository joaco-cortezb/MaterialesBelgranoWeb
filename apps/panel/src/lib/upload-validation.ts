import "server-only";

import { fileTypeFromBuffer } from "file-type";
import { isAllowedUploadFile } from "@/lib/upload-limits";

export class InvalidUploadError extends Error {}

const DETECTED_EXTENSIONS: Record<string, readonly string[]> = {
  avif: ["avif"],
  heic: ["heic", "heif"],
  heif: ["heic", "heif"],
  jpeg: ["jpg"],
  jpg: ["jpg"],
  png: ["png"],
  webp: ["webp"],
};

/** Lee los bytes y confirma que el contenido coincide con el tipo declarado. */
export async function validateUploadContent(file: File): Promise<{ data: Buffer; extension: string; contentType: string }> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!isAllowedUploadFile(file.name, file.type)) {
    throw new InvalidUploadError("Formato de archivo no permitido.");
  }

  const data = Buffer.from(await file.arrayBuffer());
  let detected: Awaited<ReturnType<typeof fileTypeFromBuffer>>;
  try {
    detected = await fileTypeFromBuffer(data);
  } catch {
    throw new InvalidUploadError("No se pudo identificar el contenido del archivo.");
  }
  if (!detected || !DETECTED_EXTENSIONS[extension]?.includes(detected.ext) || (file.type && file.type !== detected.mime)) {
    throw new InvalidUploadError("El contenido no coincide con el tipo de archivo declarado.");
  }
  return { data, extension: detected.ext, contentType: detected.mime };
}
