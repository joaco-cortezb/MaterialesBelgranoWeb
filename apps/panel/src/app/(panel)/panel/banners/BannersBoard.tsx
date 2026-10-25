"use client";

import { useState, useTransition } from "react";
import { BANNER_CONFIG, type BannerKey } from "@mb/shared";
import { Badge, Button, Card, Hint, Input, Label, PageHeader, Spinner, Switch, Textarea } from "@/components/ui";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useToast } from "@/components/ui/Toast";
import { saveBanner } from "./actions";

export type BannerDTO = { key: BannerKey; title: string; text: string; image: string; url: string; active: boolean; saved: boolean };

export function BannersBoard({ banners }: { banners: BannerDTO[] }) {
  return (
    <div>
      <PageHeader
        title="Banners"
        subtitle="Los banners del inicio. No llevan botones: si les cargás un link, todo el banner se vuelve clickeable."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {banners.map((banner) => (
          <BannerCard key={banner.key} banner={banner} />
        ))}
      </div>
    </div>
  );
}

function BannerCard({ banner }: { banner: BannerDTO }) {
  const config = BANNER_CONFIG[banner.key];
  const [title, setTitle] = useState(banner.title);
  const [text, setText] = useState(banner.text);
  const [image, setImage] = useState(banner.image);
  const [url, setUrl] = useState(banner.url);
  const [active, setActive] = useState(banner.active);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const dirty =
    !banner.saved || title !== banner.title || text !== banner.text || image !== banner.image || url !== banner.url || active !== banner.active;

  function save() {
    const formData = new FormData();
    formData.set("key", banner.key);
    formData.set("title", title);
    formData.set("text", text);
    formData.set("image", image);
    formData.set("url", url);
    formData.set("active", active ? "on" : "");
    startTransition(async () => {
      const result = await saveBanner(formData);
      if (result.ok) toast.success(result.message ?? "Guardado.");
      else toast.error(result.error);
    });
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-ink">{config.label}</h2>
          <p className="mt-0.5 text-xs text-ink-soft">{config.hint}</p>
        </div>
        <div className="flex items-center gap-2">
          {!banner.saved && <Badge>Por defecto</Badge>}
          <Switch checked={active} onChange={setActive} label={active ? "Visible" : "Oculto"} />
        </div>
      </div>

      <div className="mt-4">
        <ImageUploadField
          value={image}
          onChange={setImage}
          folder="slots"
          label="Foto del banner"
          recommended={config.recommended}
          previewClassName="aspect-[5/2] w-full"
        />
        <Hint>Opcional. Sin foto, el banner va con fondo oscuro.</Hint>
      </div>

      <div className="mt-4 grid gap-4">
        <div>
          <Label htmlFor={`title-${banner.key}`}>Título</Label>
          <Input id={`title-${banner.key}`} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={140} />
        </div>
        <div>
          <Label htmlFor={`text-${banner.key}`}>Texto (opcional)</Label>
          <Textarea id={`text-${banner.key}`} value={text} onChange={(event) => setText(event.target.value)} maxLength={280} rows={2} />
        </div>
        <div>
          <Label htmlFor={`url-${banner.key}`}>Link (opcional)</Label>
          <Input
            id={`url-${banner.key}`}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            inputMode="url"
            placeholder="https://… o /marcas"
            maxLength={500}
          />
          <Hint>Una página de esta web (/marcas, /nosotros) o una dirección completa. Vacío = el banner no es clickeable.</Hint>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={save} disabled={pending || !dirty || !title.trim()}>
          {pending ? (
            <>
              <Spinner /> Guardando…
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </Card>
  );
}
