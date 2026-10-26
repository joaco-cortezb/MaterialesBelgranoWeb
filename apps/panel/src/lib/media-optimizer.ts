import "server-only";

import sharp from "sharp";
import { UPLOAD_MAX_DIMENSION, UPLOAD_QUALITY, type UploadFolder } from "@/lib/upload-limits";
import { InvalidUploadError, validateUploadContent } from "@/lib/upload-validation";

// Una imagen a la vez por instancia: acota la memoria (cada foto grande
// decodificada ocupa cientos de MB).
sharp.concurrency(1);

/** Tope de píxeles de la imagen original (≈ 40 MP: cualquier cámara de celular). */
const MAX_INPUT_PIXELS = 40_000_000;

export type OptimizedUpload = { data: Buffer; extension: "webp"; contentType: "image/webp" };

/** Valida, rota según EXIF, reescala a la caja de la carpeta y convierte a WebP. */
export async function optimizeUploadFile(file: File, folder: UploadFolder): Promise<OptimizedUpload> {
  const { data } = await validateUploadContent(file);

  try {
    const image = sharp(data, { animated: false, limitInputPixels: MAX_INPUT_PIXELS, failOn: "error" });
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height || metadata.width * metadata.height > MAX_INPUT_PIXELS) {
      throw new InvalidUploadError("La imagen es demasiado grande (más de 40 megapíxeles).");
    }
    const optimized = await image
      .rotate()
      .resize({
        width: UPLOAD_MAX_DIMENSION[folder],
        height: UPLOAD_MAX_DIMENSION[folder],
        fit: "inside",
        withoutEnlargement: true,
      })
      // Logos: casi sin pérdida y con la transparencia intacta. Fotos: WebP de
      // alta calidad (85), que a la vista no se distingue del original.
      .webp(
        folder === "brands"
          ? { nearLossless: true, quality: UPLOAD_QUALITY.brands, alphaQuality: 100, effort: 6 }
          : { quality: UPLOAD_QUALITY[folder], alphaQuality: 100, effort: 5, smartSubsample: true },
      )
      .toBuffer();
    return { data: optimized, extension: "webp", contentType: "image/webp" };
  } catch (error) {
    if (error instanceof InvalidUploadError) throw error;
    if (/heif|heic/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)) {
      throw new InvalidUploadError(
        "Las fotos HEIC del iPhone no se pueden leer en este navegador. Exportala como JPG o activá Ajustes › Cámara › Formatos › Más compatible.",
      );
    }
    throw new InvalidUploadError("La imagen no pudo procesarse de forma segura.");
  }
}
