"use client";

import { useRef, useState } from "react";
import { ImageUp, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { downscaleImageForUpload } from "@/lib/image-downscale";
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
 * devuelve la URL pública. Si el archivo no entra en una función de Vercel,
 * lo achica en el navegador antes.
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
}: {
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  label: string;
  recommended?: readonly [number, number];
  previewClassName?: string;
  objectFit?: "cover" | "contain";
  position?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const accept = ACCEPTED_IMAGE_EXTENSIONS.map((extension) => `.${extension}`).join(",");

  async function handleFile(file: File) {
    if (!isAllowedUploadFile(file.name, file.type)) {
      toast.error("Formato no permitido. Usá JPG, PNG o WEBP.");
      return;
    }
    if (file.size > CLIENT_MAX_MB * 1024 * 1024) {
      toast.error(`El archivo supera los ${CLIENT_MAX_MB} MB.`);
      return;
    }

    setUploading(true);
    try {
      let upload = file;
      if (upload.size > FUNCTION_UPLOAD_LIMIT_BYTES) {
        const smaller = await downscaleImageForUpload(upload, folder);
        if (!smaller) {
          toast.error(`No se pudo procesar "${file.name}". Guardala como JPG o PNG más liviana e intentá de nuevo.`);
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
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-xl transition-colors",
          value ? "border border-line" : "border-2 border-dashed border-line hover:border-brand-400",
          dragging && "border-brand-600 bg-brand-50",
          previewClassName ?? "aspect-video w-full",
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

        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className={cn("h-full w-full", objectFit === "contain" ? "object-contain p-4" : "object-cover")}
              style={{ objectPosition: position }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 text-white opacity-0 transition-opacity group-hover:bg-ink/50 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="inline-flex items-center gap-2 rounded-lg bg-ink/70 px-3 py-1.5 text-sm font-semibold">
                <ImageUp className="h-4 w-4" /> Reemplazar
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-ink-soft">
            <ImageUp className="h-7 w-7" />
            <span className="text-sm font-semibold text-ink">Tocá o arrastrá una imagen</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-surface/80 text-sm font-semibold text-ink">
            <Spinner /> Subiendo…
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <p className="text-xs leading-relaxed text-ink-soft">{uploadHint(folder, recommended)}</p>
        {value && (
          <button type="button" onClick={() => onChange("")} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--color-danger)] hover:underline">
            <Trash2 className="h-3.5 w-3.5" /> Quitar
          </button>
        )}
      </div>
    </div>
  );
}
