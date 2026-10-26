"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, CircleAlert, PlayCircle } from "lucide-react";
import { youtubeVideoId } from "@mb/shared";
import { Badge, Button, Card, Hint, Input, Label, PageHeader, Spinner } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { saveHomeVideo } from "./actions";

export function HomeVideoForm({ initialUrl }: { initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const videoId = youtubeVideoId(url);
  const invalid = url.trim() !== "" && !videoId;
  const savedId = youtubeVideoId(initialUrl);

  function save(nextUrl: string) {
    const formData = new FormData();
    formData.set("videoUrl", nextUrl);
    startTransition(async () => {
      const result = await saveHomeVideo(formData);
      if (result.ok) toast.success(result.message ?? "Guardado.");
      else toast.error(result.error);
    });
  }

  return (
    <div>
      <PageHeader
        title="Video del inicio"
        subtitle="Un video de YouTube que aparece en el inicio, debajo de la portada. Arranca solo y sin sonido cuando el visitante llega a esa parte."
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Card className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-ink">Link del video</h2>
            <Badge tone={savedId ? "green" : "gray"}>{savedId ? "Publicado" : "Sin video"}</Badge>
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
            />
            <p className={`mt-1.5 flex items-center gap-1.5 text-xs ${invalid ? "text-[var(--color-danger)]" : videoId ? "text-[var(--color-success)]" : "text-ink-soft"}`}>
              {invalid ? (
                <>
                  <CircleAlert className="h-3.5 w-3.5" /> Ese link no es de un video de YouTube.
                </>
              ) : videoId ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Link válido.
                </>
              ) : (
                "Sirve el link normal, el corto (youtu.be) o el de un short."
              )}
            </p>
          </div>
          <Hint>El video tiene que ser público o “no listado” en YouTube; si es privado, no se puede ver en la web.</Hint>
          <div className="mt-auto flex flex-wrap justify-end gap-2">
            {savedId && (
              <Button variant="ghost" onClick={() => save("")} disabled={pending}>
                Quitar video
              </Button>
            )}
            <Button onClick={() => save(url)} disabled={pending || url === initialUrl || invalid || !videoId}>
              {pending ? (
                <>
                  <Spinner /> Guardando…
                </>
              ) : (
                "Publicar video"
              )}
            </Button>
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
                <p className="text-sm">{invalid ? "Revisá el link." : "Pegá un link para ver el video acá."}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
