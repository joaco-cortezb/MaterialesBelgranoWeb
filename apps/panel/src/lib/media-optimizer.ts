import "server-only";

import sharp from "sharp";
import { UPLOAD_MAX_DIMENSION, UPLOAD_QUALITY, type UploadFolder } from "@/lib/upload-limits";
import { InvalidUploadError, validateUploadContent } from "@/lib/upload-validation";

export type OptimizedUpload = { data: Buffer; extension: "webp"; contentType: "image/webp" };

/** Valida, rota según EXIF, reescala a la caja de la carpeta y convierte a WebP. */
export async function optimizeUploadFile(file: File, folder: UploadFolder): Promise<OptimizedUpload> {
  const { data } = await validateUploadContent(file);

  try {
    const image = sharp(data, { animated: false, limitInputPixels: 50_000_000, failOn: "error" });
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height || metadata.width > 12_000 || metadata.height > 12_000) {
      throw new InvalidUploadError("La imagen tiene medidas inválidas.");
    }
    const optimized = await image
      .rotate()
      .resize({
        width: UPLOAD_MAX_DIMENSION[folder],
        height: UPLOAD_MAX_DIMENSION[folder],
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: UPLOAD_QUALITY[folder], effort: 5, smartSubsample: true })
      .toBuffer();
    return { data: optimized, extension: "webp", contentType: "image/webp" };
  } catch (error) {
    if (error instanceof InvalidUploadError) throw error;
    throw new InvalidUploadError("La imagen no pudo procesarse de forma segura.");
  }
}
