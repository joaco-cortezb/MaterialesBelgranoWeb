/**
 * FUENTE ÚNICA DE VERDAD de los límites de subida. La importa el servidor
 * (`media-optimizer.ts`) y los campos del cliente, así el texto de ayuda no
 * puede desincronizarse de lo que el sistema hace. Sin dependencias de server.
 */
export type UploadFolder = "brands" | "slots";

/** Sección de permisos que autoriza cada carpeta. */
export const UPLOAD_MANAGE_SECTION = {
  brands: "marcas",
  slots: "imagenes",
} as const;

/** Lado máximo al que reescala el servidor (`fit: inside`, nunca agranda). */
export const UPLOAD_MAX_DIMENSION: Readonly<Record<UploadFolder, number>> = {
  brands: 800,
  slots: 2400,
};

/** Calidad WebP por carpeta. */
export const UPLOAD_QUALITY: Readonly<Record<UploadFolder, number>> = {
  brands: 88,
  slots: 82,
};

/**
 * Vercel corta el body de una función en 4,5 MB. Lo que viaja por
 * `/api/upload` no puede superar esto; las fotos más pesadas se achican en el
 * navegador antes (`image-downscale.ts`).
 */
export const MAX_FUNCTION_UPLOAD_MB = 4;
export const FUNCTION_UPLOAD_LIMIT_BYTES = MAX_FUNCTION_UPLOAD_MB * 1024 * 1024;

/** Peso máximo del archivo original que acepta el campo (se achica en el cliente si hace falta). */
export const CLIENT_MAX_MB = 20;

/**
 * Extensiones aceptadas. Sin SVG a propósito: es XML que puede llevar
 * `<script>` y se publicaría tal cual en un dominio del negocio.
 */
export const ACCEPTED_IMAGE_EXTENSIONS = ["avif", "jpeg", "jpg", "png", "webp", "heic", "heif"] as const;

const MIME_BY_EXTENSION: Readonly<Record<string, readonly string[]>> = {
  avif: ["image/avif"],
  heic: ["image/heic", "image/heif"],
  heif: ["image/heic", "image/heif"],
  jpeg: ["image/jpeg"],
  jpg: ["image/jpeg"],
  png: ["image/png"],
  webp: ["image/webp"],
};

/** Se valida por MIME **y** extensión: el MIME lo manda el navegador y es falsificable. */
export function isAllowedUploadFile(fileName: string, contentType: string): boolean {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (!(ACCEPTED_IMAGE_EXTENSIONS as readonly string[]).includes(extension)) return false;
  if (!contentType) return true;
  return MIME_BY_EXTENSION[extension]?.includes(contentType) ?? false;
}

export function uploadHint(folder: UploadFolder, recommended?: readonly [number, number]): string {
  const size = recommended ? `${recommended[0]} × ${recommended[1]} px` : `hasta ${UPLOAD_MAX_DIMENSION[folder]} px de lado`;
  return `${size} · JPG, PNG o WEBP · hasta ${CLIENT_MAX_MB} MB`;
}
