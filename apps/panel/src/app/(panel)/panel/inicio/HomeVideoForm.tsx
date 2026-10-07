"use client";

import { useState, useTransition } from "react";
import { youtubeVideoId } from "@mb/shared";
import { Button, Card, Hint, Input, Label, PageHeader, Spinner } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { saveHomeVideo } from "./actions";

export function HomeVideoForm({ initialUrl }: { initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const videoId = youtubeVideoId(url);

  function save() {
    const formData = new FormData();
    formData.set("videoUrl", url);
    startTransition(async () => {
      const result = await saveHomeVideo(formData);
      if (result.ok) toast.success(result.message ?? "Guardado.");
      else toast.error(result.error);
    });
  }

  return (
    <div>
      <PageHeader title="Video del inicio" subtitle="Un video de YouTube que se muestra en la página de inicio. Dejalo vacío para ocultar la sección." />
      <Card className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div>
            <Label htmlFor="videoUrl">Link de YouTube</Label>
            <Input id="videoUrl" type="url" inputMode="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
            <Hint>Sirve el link normal, el corto (youtu.be) o el de un short. El video tiene que ser público o no listado.</Hint>
          </div>
          <Button onClick={save} disabled={pending || url === initialUrl || (url !== "" && !videoId)}>
            {pending ? (
              <>
                <Spinner /> Guardando…
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </div>
        <div>
          <Label>Vista previa</Label>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-2">
            {videoId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="Miniatura del video" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center text-sm text-ink-soft">{url ? "El link no parece de YouTube." : "Sin video."}</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
