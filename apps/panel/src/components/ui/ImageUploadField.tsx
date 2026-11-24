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
  removeMessage = "La imagen deja de verse en la web. Podés volver a subirla cuando quieras.",
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
  /** Texto del modal de "Quitar" (cada pantalla explica qué pasa en la web). */
  removeMessage?: string;
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
    <div className="space-y-1.5">
      <div className="group/media @container relative">
      <div
        role="button"
        tabIndex={0}
        aria-label={`${value ? "Reemplazar" : "Subir"} ${label.toLowerCase()}`}
        aria-disabled={uploading || undefined}
        aria-busy={uploading || undefined}
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
        onDragLeave={(event) => {
          // Pasar por encima de la imagen o del texto de adentro no cuenta como salir.
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file && !uploading) void handleFile(file);
        }}
        style={aspectRatio ? { aspectRatio } : undefined}
        className={cn(
          "group relative w-full cursor-pointer overflow-hidden rounded-xl transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2",
          uploading && "cursor-wait",
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
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-4 text-center text-ink-soft">
            <ImageUp className="h-7 w-7" />
            <span className="text-sm font-semibold text-ink">Tocá o arrastrá una imagen</span>
            {recommended && <span className="text-xs">{recommended[0]} × {recommended[1]} px</span>}
          </div>
        )}

        {uploading && (
          <div role="status" className="absolute inset-0 flex items-center justify-center gap-2 bg-surface/80 text-sm font-semibold text-ink">
            <Spinner /> Subiendo…
          </div>
        )}
      </div>

      {/* Acciones sobre la foto: Reemplazar y Quitar juntas, al medio. Con mouse
          aparecen al pasar por encima; en touch (sin hover) quedan siempre a la vista. */}
      {shown && !uploading && (
        <div className="pointer-events-none absolute inset-0 flex flex-wrap content-center items-center justify-center gap-1.5 rounded-xl p-1.5 transition-[background-color] duration-150 [@media(hover:hover)]:group-hover/media:bg-ink/45 [@media(hover:hover)]:group-focus-within/media:bg-ink/45">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label={`${isFallback ? "Subir" : "Reemplazar"} ${label.toLowerCase()}`}
            className="pointer-events-auto inline-flex min-h-8 min-w-8 items-center justify-center gap-1.5 rounded-lg bg-ink/80 px-2 text-xs @[15rem]:px-2.5 font-semibold text-white transition-opacity hover:bg-ink focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/media:opacity-100 [@media(hover:hover)]:group-focus-within/media:opacity-100"
          >
            <ImageUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {/* En recuadros angostos (logos, fotos de celular) van sólo los íconos. */}
            <span className="hidden @[15rem]:inline">{isFallback ? "Subir" : "Reemplazar"}</span>
          </button>
          {value && (
            <button
              type="button"
              onClick={() => setConfirmRemove(true)}
              aria-label={`Quitar ${label.toLowerCase()}`}
              className="pointer-events-auto inline-flex min-h-8 min-w-8 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-danger)] px-2 text-xs @[15rem]:px-2.5 font-semibold text-white transition-opacity hover:brightness-110 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/media:opacity-100 [@media(hover:hover)]:group-focus-within/media:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="hidden @[15rem]:inline">Quitar</span>
            </button>
          )}
        </div>
      )}
      </div>

      {/* Una sola línea debajo: la medida (y en columnas anchas, formatos y peso). */}
      <p className={cn("text-xs text-ink-soft", compactHint ? "truncate tabular-nums" : "leading-relaxed")}>
        {compactHint && recommended ? `${recommended[0]} × ${recommended[1]}` : uploadHint(folder, recommended)}
      </p>

      <ConfirmDialog
        open={confirmRemove}
        title="¿Quitar esta imagen?"
        message={removeMessage}
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
