/**
 * Achica una imagen EN EL NAVEGADOR antes de subirla, por el tope de body de
 * las funciones de Vercel (~4,5 MB). El servidor reescala igual y convierte
 * a WebP, así que no se pierde nada. Sólo se usa cuando el original no entra.
 */
import { UPLOAD_MAX_DIMENSION, type UploadFolder } from "@/lib/upload-limits";

export const CLIENT_RESIZE_TARGET_BYTES = 3 * 1024 * 1024;
const QUALITY_STEPS = [0.92, 0.85, 0.78, 0.7, 0.6] as const;

/** `null` si el navegador no puede decodificar (HEIC en Chrome) o no logra entrar en el objetivo. */
export async function downscaleImageForUpload(
  file: File,
  folder: UploadFolder,
  targetBytes = CLIENT_RESIZE_TARGET_BYTES,
): Promise<File | null> {
  if (typeof createImageBitmap !== "function") return null;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null;
  }

  try {
    const maxDimension = UPLOAD_MAX_DIMENSION[folder];
    for (const boxScale of [1, 0.5]) {
      const box = Math.round(maxDimension * boxScale);
      const scale = Math.min(1, box / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) return null;
      context.drawImage(bitmap, 0, 0, width, height);

      for (const quality of QUALITY_STEPS) {
        const blob = await toBlob(canvas, quality);
        if (!blob) return null;
        if (blob.size <= targetBytes) {
          const base = file.name.replace(/\.[^./\\]+$/, "") || "imagen";
          return new File([blob], `${base}.webp`, { type: "image/webp", lastModified: Date.now() });
        }
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    bitmap.close();
  }
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/webp", quality));
}
