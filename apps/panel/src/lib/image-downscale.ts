/**
 * Prepara una imagen EN EL NAVEGADOR antes de subirla:
 * - Si pesa más de lo que acepta una función de Vercel (~4,5 MB), la achica.
 * - Si es HEIC (iPhone), la convierte siempre: el servidor no puede leerla.
 * El servidor reescala igual y la pasa a WebP, así que se trabaja con margen
 * de calidad alto (0.92 → 0.84) y sin achicar de más.
 */
import { UPLOAD_MAX_DIMENSION, type UploadFolder } from "@/lib/upload-limits";

export const CLIENT_RESIZE_TARGET_BYTES = Math.round(3.8 * 1024 * 1024);
const QUALITY_STEPS = [0.92, 0.88, 0.84] as const;

export function isHeic(file: File): boolean {
  return /image\/hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
}

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

  // Los logos conservan la transparencia.
  const keepAlpha = folder === "brands";

  try {
    const maxDimension = UPLOAD_MAX_DIMENSION[folder];
    for (const boxScale of [1, 0.75]) {
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
        const blob = await encode(canvas, quality, keepAlpha);
        if (!blob) return null;
        if (blob.size <= targetBytes) {
          const base = file.name.replace(/\.[^./\\]+$/, "") || "imagen";
          const extension = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1];
          return new File([blob], `${base}.${extension}`, { type: blob.type, lastModified: Date.now() });
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

/**
 * WebP si el navegador sabe generarlo; si no (Safari devuelve PNG en
 * silencio), JPEG para fotos o PNG para logos con transparencia.
 */
async function encode(canvas: HTMLCanvasElement, quality: number, keepAlpha: boolean): Promise<Blob | null> {
  const webp = await toBlob(canvas, "image/webp", quality);
  if (webp?.type === "image/webp") return webp;
  return toBlob(canvas, keepAlpha ? "image/png" : "image/jpeg", quality);
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality));
}
