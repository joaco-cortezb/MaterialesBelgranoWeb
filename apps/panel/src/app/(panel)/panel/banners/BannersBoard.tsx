"use client";

import { useState, useTransition } from "react";
import { BANNER_CONFIG, BANNER_MOBILE_SIZE, BANNER_SIZE, type BannerKey } from "@mb/shared";
import { Badge, Button, Card, Hint, Input, Label, PageHeader, Switch, Textarea } from "@/components/ui";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useToast } from "@/components/ui/Toast";
import { saveBanner } from "./actions";

export type BannerDTO = {
  key: BannerKey;
  title: string;
  text: string;
  image: string;
  imageMobile: string;
  url: string;
  active: boolean;
  saved: boolean;
};

export function BannersBoard({ banners }: { banners: BannerDTO[] }) {
  return (
    <div>
      <PageHeader
        title="Banners"
        subtitle={`Cada banner es sólo imagen (el texto va en el diseño): una de ${BANNER_SIZE[0]} × ${BANNER_SIZE[1]} px para computadora y otra de ${BANNER_MOBILE_SIZE[0]} × ${BANNER_MOBILE_SIZE[1]} px para celular. Si les cargás un link, todo el banner es clickeable.`}
      />
      <div className="grid gap-5">
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
  const [imageMobile, setImageMobile] = useState(banner.imageMobile);
  const [url, setUrl] = useState(banner.url);
  const [active, setActive] = useState(banner.active);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const dirty =
    !banner.saved || title !== banner.title || image !== banner.image || imageMobile !== banner.imageMobile || url !== banner.url || active !== banner.active;

  function save() {
    const formData = new FormData();
    formData.set("key", banner.key);
    formData.set("title", title);
    formData.set("text", "");
    formData.set("image", image);
    formData.set("imageMobile", imageMobile);
    formData.set("url", url);
    formData.set("active", active ? "on" : "");
    startTransition(async () => {
      const result = await saveBanner(formData);
      if (result.ok) toast.success(result.message ?? "Guardado.");
      else toast.error(result.error);
    });
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-ink">{config.label}</h2>
          <p className="mt-0.5 text-xs text-ink-soft">{config.hint}</p>
        </div>
        <div className="flex items-center gap-2">
          {!banner.saved && <Badge>Por defecto</Badge>}
          <Switch checked={active} onChange={setActive} label="Mostrar en la web" text={active ? "Visible" : "Oculto"} />
        </div>
      </div>

      <div className="mt-5 grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <Label>Computadora</Label>
          <ImageUploadField
            value={image}
            onChange={setImage}
            folder="slots"
            label="Banner para computadora"
            recommended={BANNER_SIZE}
          />
        </div>
        <div className="max-w-[260px] md:max-w-none">
          <Label>Celular</Label>
          <ImageUploadField
            value={imageMobile}
            onChange={setImageMobile}
            folder="slots"
            label="Banner para celular"
            recommended={BANNER_MOBILE_SIZE}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
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

      <div className="mt-5 flex justify-end border-t border-line pt-4">
        <Button onClick={save} loading={pending} loadingText="Guardando…" disabled={!dirty || !title.trim() || !image || !imageMobile}>
          Guardar
        </Button>
      </div>
    </Card>
  );
}
