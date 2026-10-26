"use client";

import { useRef, useState } from "react";
import { ImageUp, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { downscaleImageForUpload, isHeic } from "@/lib/image-downscale";
import { resolveMediaSrc } from "@/lib/media-src";
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  CLIENT_MAX_MB,
  FUNCTION_UPLOAD_LIMIT_BYTES,
  isAllowedUploadFile,
  uploadHint,
  type UploadFolder,
} from "@/lib/upload-limits";

type UploadResponse = { ok: true; url: string } | { ok: false; error?: string };

/**
 * Campo de imagen: arrastrar o tocar para elegir, sube a `/api/upload` y
 * devuelve la URL pública. Si el archivo no entra en una función de Vercel (o
 * es HEIC), lo prepara en el navegador antes. La vista previa usa la misma
 * proporción que `recommended`, así se ve el encuadre real.
 */
export function ImageUploadField({
  value,
  onChange,
  folder,
  label,
  recommended,
  previewClassName,
  objectFit = "cover",
  position = "50% 50%",
  fallbackSrc,
  compactHint = false,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  label: string;
  recommended?: readonly [number, number];
  previewClassName?: string;
  objectFit?: "cover" | "contain";
  position?: string;
  /** Imagen que muestra la web cuando no hay nada cargado. */
  fallbackSrc?: string;
  /** Sólo la medida recomendada debajo (para columnas angostas). */
  compactHint?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const accept = ACCEPTED_IMAGE_EXTENSIONS.map((extension) => `.${extension}`).join(",");

  async function handleFile(file: File) {
    if (!isAllowedUploadFile(file.name, file.type)) {
      toast.error("Formato no permitido. Usá JPG, PNG, WEBP o HEIC.");
      return;
    }
    if (file.size > CLIENT_MAX_MB * 1024 * 1024) {
      toast.error(`El archivo supera los ${CLIENT_MAX_MB} MB.`);
      return;
    }

    setUploading(true);
    try {
      let upload = file;
      if (upload.size > FUNCTION_UPLOAD_LIMIT_BYTES || isHeic(upload)) {
        const smaller = await downscaleImageForUpload(upload, folder);
        if (!smaller) {
          toast.error(
            isHeic(file)
              ? "Las fotos HEIC del iPhone no se pueden leer en este navegador. Exportala como JPG o probá desde Safari."
              : `No se pudo procesar "${file.name}". Guardala como JPG y probá de nuevo.`,
          );
          return;
        }
        upload = smaller;
      }

      const formData = new FormData();
      formData.set("file", upload);
      formData.set("folder", folder);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const result = (await response.json().catch(() => null)) as UploadResponse | null;

      if (!response.ok || !result || !result.ok) {
        toast.error((result && !result.ok && result.error) || "No se pudo subir la imagen. Intentá de nuevo.");
        return;
      }
      onChange(result.url);
      toast.success("Imagen subida.");
    } catch {
      toast.error(`No se pudo subir "${file.name}". Revisá tu conexión.`);
    } finally {
      setUploading(false);
    }
  }

  const shown = value || fallbackSrc || "";
  const isFallback = !value && Boolean(fallbackSrc);
  // Si `previewClassName` no fija una proporción, se usa la de la medida recomendada.
  const aspectRatio = previewClassName?.includes("aspect-") || !recommended ? undefined : `${recommended[0]} / ${recommended[1]}`;

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Subir ${label.toLowerCase()}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!uploading) inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!uploading) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file && !uploading) void handleFile(file);
        }}
        style={aspectRatio ? { aspectRatio } : undefined}
        className={cn(
          "group relative w-full cursor-pointer overflow-hidden rounded-xl transition-colors",
          shown ? "border border-line" : "border-2 border-dashed border-line hover:border-brand-400",
          objectFit === "contain" && "bg-surface-2",
          dragging && "border-brand-600 bg-brand-50",
          previewClassName ?? (aspectRatio ? undefined : "aspect-video"),
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.target.value = "";
          }}
        />

        {shown ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveMediaSrc(shown)}
              alt=""
              className={cn("absolute inset-0 h-full w-full", objectFit === "contain" ? "object-contain p-4" : "object-cover", isFallback && "opacity-60")}
              style={{ objectPosition: position }}
            />
            {isFallback && (
              <span className="absolute left-2 top-2 rounded-full bg-ink/75 px-2.5 py-0.5 text-[11px] font-semibold text-white">Imagen por defecto</span>
            )}
            {/* En touch no hay hover: el botón queda siempre visible en pantallas chicas. */}
            <div className="absolute inset-0 flex items-end justify-end p-2 text-white transition-[background-color] sm:items-center sm:justify-center sm:p-0 sm:group-hover:bg-ink/50">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/75 px-2.5 py-1 text-xs font-semibold sm:px-3 sm:py-1.5 sm:text-sm sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                <ImageUp className="h-4 w-4" /> {isFallback ? "Subir" : "Reemplazar"}
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-4 text-center text-ink-soft">
            <ImageUp className="h-7 w-7" />
            <span className="text-sm font-semibold text-ink">Tocá o arrastrá una imagen</span>
            {recommended && <span className="text-xs">{recommended[0]} × {recommended[1]} px</span>}
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-surface/80 text-sm font-semibold text-ink">
            <Spinner /> Subiendo…
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <p className="text-xs leading-relaxed text-ink-soft">
          {compactHint && recommended ? `${recommended[0]} × ${recommended[1]} px` : uploadHint(folder, recommended)}
        </p>
        {value && (
          <button
            type="button"
            onClick={() => setConfirmRemove(true)}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--color-danger)] hover:underline"
          >
            <Trash2 className="h-3.5 w-3.5" /> Quitar
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmRemove}
        title="¿Quitar esta imagen?"
        message="La imagen deja de verse en la web. Podés volver a subirla cuando quieras."
        confirmLabel="Quitar"
        danger
        onCancel={() => setConfirmRemove(false)}
        onConfirm={() => {
          setConfirmRemove(false);
          onChange("");
        }}
      />
    </div>
  );
}
