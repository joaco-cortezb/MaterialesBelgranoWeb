"use client";

import { useState, useTransition } from "react";
import { IMAGE_SLOTS, type ImageSlotDefinition } from "@mb/shared";
import { Card, Spinner } from "@/components/ui";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useToast } from "@/components/ui/Toast";
import { saveImageSlot } from "../imagenes/actions";

export type PhotoValue = { url: string; alt: string; position: string };

const NOSOTROS_SLOTS = IMAGE_SLOTS.filter((slot) => slot.group === "nosotros");

/**
 * Fotos del negocio de la página Nosotros: sólo la imagen. Se guarda sola al
 * subirla; quitarla (con confirmación) vuelve a la foto por defecto.
 */
export function NosotrosPhotos({ values, canManage }: { values: Record<string, PhotoValue>; canManage: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {NOSOTROS_SLOTS.map((slot) => (
        <PhotoCard key={slot.key} slot={slot} value={values[slot.key]} canManage={canManage} />
      ))}
    </div>
  );
}

function PhotoCard({ slot, value, canManage }: { slot: ImageSlotDefinition; value?: PhotoValue; canManage: boolean }) {
  const [url, setUrl] = useState(value?.url ?? "");
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function save(nextUrl: string) {
    const previous = url;
    setUrl(nextUrl);
    const formData = new FormData();
    formData.set("key", slot.key);
    formData.set("url", nextUrl);
    formData.set("alt", value?.alt || slot.fallbackAlt);
    formData.set("position", value?.position || "50% 50%");
    startTransition(async () => {
      const result = await saveImageSlot(formData);
      if (result.ok) toast.success(result.message ?? "Guardado.");
      else {
        setUrl(previous);
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex min-h-7 items-center justify-between gap-3">
        <h3 className="font-bold text-ink">{slot.label}</h3>
        {pending && <Spinner className="text-brand-700" />}
      </div>
      <div className="mt-3">
        {canManage ? (
          <ImageUploadField
            value={url}
            onChange={save}
            folder="slots"
            label={slot.label}
            recommended={slot.recommended}
            fallbackSrc={slot.fallback || undefined}
            compactHint
          />
        ) : (
          <p className="text-sm text-ink-soft">Sólo lectura.</p>
        )}
      </div>
    </Card>
  );
}
