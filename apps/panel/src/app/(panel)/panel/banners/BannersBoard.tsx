"use client";

import { useState, useTransition } from "react";
import { BANNER_CONFIG, BANNER_SIZE, type BannerKey } from "@mb/shared";
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
        subtitle={`Los banners del inicio son sólo una imagen (con el texto ya incluido en el diseño), todos de ${BANNER_SIZE[0]} × ${BANNER_SIZE[1]} px. Si les cargás un link, todo el banner es clickeable.`}
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
  const [image, setImage] = useState(banner.image);
  const [url, setUrl] = useState(banner.url);
  const [active, setActive] = useState(banner.active);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const dirty =
    !banner.saved || title !== banner.title || image !== banner.image || url !== banner.url || active !== banner.active;

  function save() {
    const formData = new FormData();
    formData.set("key", banner.key);
    formData.set("title", title);
    formData.set("text", "");
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
          recommended={BANNER_SIZE}
          objectFit="cover"
          previewClassName="aspect-[12/5] w-full"
        />
      </div>

      <div className="mt-4 grid gap-4">
        <div>
          <Label htmlFor={`title-${banner.key}`}>Qué dice el banner</Label>
          <Textarea id={`title-${banner.key}`} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} rows={2} />
          <Hint>El texto que aparece en la imagen. No se muestra encima: lo leen Google y los lectores de pantalla.</Hint>
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
        <Button onClick={save} disabled={pending || !dirty || !title.trim() || !image}>
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
