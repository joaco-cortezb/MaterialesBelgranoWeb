"use client";

import { useState, useTransition } from "react";
import { IMAGE_SLOT_GROUP_LABELS, IMAGE_SLOTS, type ImageSlotDefinition, type ImageSlotGroup } from "@mb/shared";
import { Badge, Button, Card, Hint, Input, Label, PageHeader, Select, Spinner } from "@/components/ui";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useToast } from "@/components/ui/Toast";
import { saveImageSlot } from "./actions";

export type SlotValue = { url: string; alt: string; position: string };

const POSITIONS = [
  { value: "50% 50%", label: "Centro" },
  { value: "50% 0%", label: "Arriba" },
  { value: "50% 100%", label: "Abajo" },
  { value: "0% 50%", label: "Izquierda" },
  { value: "100% 50%", label: "Derecha" },
  { value: "50% 25%", label: "Centro-arriba" },
  { value: "50% 75%", label: "Centro-abajo" },
];

const GROUPS: ImageSlotGroup[] = ["inicio", "nosotros", "servicios", "rubros"];

export function ImageSlotsBoard({ values }: { values: Record<string, SlotValue> }) {
  const [group, setGroup] = useState<ImageSlotGroup>("inicio");
  const slots = IMAGE_SLOTS.filter((slot) => slot.group === group);

  return (
    <div>
      <PageHeader title="Imágenes" subtitle="Cada lugar de la web tiene su foto. Reemplazala acá; si la quitás, vuelve la imagen por defecto." />

      <div role="tablist" aria-label="Sección de la web" className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-surface-2 p-1">
        {GROUPS.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={group === item}
            onClick={() => setGroup(item)}
            className={`min-h-10 shrink-0 rounded-lg px-4 text-sm font-semibold transition-colors ${group === item ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink"}`}
          >
            {IMAGE_SLOT_GROUP_LABELS[item]}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {slots.map((slot) => (
          <SlotCard key={slot.key} slot={slot} initial={values[slot.key]} />
        ))}
      </div>
    </div>
  );
}

function SlotCard({ slot, initial }: { slot: ImageSlotDefinition; initial?: SlotValue }) {
  const [url, setUrl] = useState(initial?.url ?? "");
  const [alt, setAlt] = useState(initial?.alt ?? slot.fallbackAlt);
  const [position, setPosition] = useState(initial?.position ?? "50% 50%");
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const dirty = url !== (initial?.url ?? "") || alt !== (initial?.alt ?? slot.fallbackAlt) || position !== (initial?.position ?? "50% 50%");
  const [ratioW, ratioH] = slot.recommended;

  function save() {
    const formData = new FormData();
    formData.set("key", slot.key);
    formData.set("url", url);
    formData.set("alt", alt);
    formData.set("position", position);
    startTransition(async () => {
      const result = await saveImageSlot(formData);
      if (result.ok) toast.success(result.message ?? "Guardado.");
      else toast.error(result.error);
    });
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-ink">{slot.label}</h2>
          <p className="mt-0.5 text-xs text-ink-soft">{slot.hint}</p>
        </div>
        <Badge tone={initial?.url ? "green" : "gray"}>{initial?.url ? "Personalizada" : "Por defecto"}</Badge>
      </div>

      <div className="mt-4">
        <ImageUploadField
          value={url}
          onChange={setUrl}
          folder="slots"
          label={slot.label}
          recommended={slot.recommended}
          position={position}
          previewClassName="w-full"
        />
        <style>{`.slot-${slot.key.replace(/\./g, "-")} { aspect-ratio: ${ratioW} / ${ratioH}; }`}</style>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_160px]">
        <div>
          <Label htmlFor={`alt-${slot.key}`}>Descripción (texto alternativo)</Label>
          <Input id={`alt-${slot.key}`} value={alt} onChange={(event) => setAlt(event.target.value)} maxLength={200} />
          <Hint>Qué se ve en la foto. Lo leen Google y los lectores de pantalla.</Hint>
        </div>
        <div>
          <Label htmlFor={`pos-${slot.key}`}>Encuadre</Label>
          <Select id={`pos-${slot.key}`} value={position} onChange={(event) => setPosition(event.target.value)}>
            {POSITIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={save} disabled={pending || !dirty}>
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
