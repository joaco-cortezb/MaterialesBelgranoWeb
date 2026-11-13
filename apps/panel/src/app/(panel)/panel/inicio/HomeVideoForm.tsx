"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, CircleAlert, PlayCircle } from "lucide-react";
import { youtubeVideoId } from "@mb/shared";
import { Badge, Button, Card, Input, Label, LoadErrorNotice, PageHeader, SaveNote } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { saveHomeVideo } from "./actions";

export function HomeVideoForm({ initialUrl, loadError = false }: { initialUrl: string; loadError?: boolean }) {
  const [url, setUrl] = useState(initialUrl);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const videoId = youtubeVideoId(url);
  const invalid = url.trim() !== "" && !videoId;
  const savedId = youtubeVideoId(initialUrl);

  function save(nextUrl: string, onDone?: () => void) {
    const formData = new FormData();
    formData.set("videoUrl", nextUrl);
    startTransition(async () => {
      const result = await saveHomeVideo(formData);
      if (result.ok) {
        // Al quitarlo también se vacía el campo: si no, quedaba el link viejo
        // con "Publicar" habilitado y la vista previa mostrando el video.
        setUrl(nextUrl);
        toast.success(result.message ?? "Guardado.");
        onDone?.();
      } else toast.error(result.error);
    });
  }

  return (
    <div>
      <PageHeader
        title="Video del inicio"
        subtitle="El inicio muestra el video de marca debajo de la portada. Si cargás un link de YouTube acá, se muestra ese en su lugar. Arranca solo y sin sonido cuando el visitante llega a esa parte."
      />
      {loadError && <LoadErrorNotice what="los datos del video" />}
      <div className="mx-auto grid max-w-4xl gap-5">
        <Card className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-ink">Link del video</h2>
            <Badge tone={savedId ? "green" : "gray"}>
              {savedId ? "YouTube publicado" : "Video de marca"}
            </Badge>
          </div>
          <div>
            <Label htmlFor="videoUrl">Link de YouTube</Label>
            <Input
              id="videoUrl"
              type="url"
              inputMode="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              aria-invalid={invalid}
              aria-describedby="videoUrl-status"
            />
            <p
              id="videoUrl-status"
              aria-live="polite"
              className={`mt-1.5 flex items-center gap-1.5 text-xs ${invalid ? "text-[var(--color-danger)]" : videoId ? "text-[var(--color-success)]" : "text-ink-soft"}`}
            >
              {invalid ? (
                <>
                  <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Ese link no es de un video de YouTube. Copialo desde “Compartir” en YouTube.
                </>
              ) : videoId ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Link válido.
                </>
              ) : (
                "Sirve el link normal, el corto (youtu.be) o el de un short."
              )}
            </p>
          </div>
          <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-ink-soft">
              El video tiene que ser público o “no listado” en YouTube.
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <SaveNote dirty={url !== initialUrl && Boolean(videoId)} />
              {savedId && (
                <Button variant="ghost" onClick={() => setConfirmRemove(true)} disabled={pending} className="text-[var(--color-danger)] hover:text-[var(--color-danger)]">
                  Quitar video
                </Button>
              )}
              <Button onClick={() => save(url)} disabled={url === initialUrl || invalid || !videoId} loading={pending && !confirmRemove} loadingText="Publicando…">
                Publicar video
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="font-bold text-ink">Vista previa</h2>
          <div className="relative mt-4 aspect-video overflow-hidden rounded-xl bg-sidebar">
            {videoId ? (
              <iframe
                key={videoId}
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                title="Vista previa del video"
                allow="encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-white/70">
                <PlayCircle className="h-10 w-10" />
                <p className="text-sm">
                  {invalid
                    ? "Revisá el link."
                    : "Sin link, el inicio muestra el video de marca. Pegá un link de YouTube para reemplazarlo."}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmRemove}
        title="¿Quitar el video de YouTube?"
        message="El inicio vuelve a mostrar el video de marca. Podés volver a publicar el de YouTube pegando el link de nuevo."
        confirmLabel="Quitar video"
        danger
        loading={pending}
        onCancel={() => setConfirmRemove(false)}
        onConfirm={() => save("", () => setConfirmRemove(false))}
      />
    </div>
  );
}
