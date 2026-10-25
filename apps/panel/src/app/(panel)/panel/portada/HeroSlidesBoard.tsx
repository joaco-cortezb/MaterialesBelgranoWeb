"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { HERO_FALLBACK_SLIDES, HERO_MAX_SLIDES, HERO_RECOMMENDED } from "@mb/shared";
import { Badge, Button, Card, Hint, IconButton, Input, Label, PageHeader, Select, Spinner, Switch } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions";
import { deleteHeroSlide, reorderHeroSlide, saveHeroSlide, toggleHeroSlideActive } from "./actions";

export type HeroSlideDTO = { id: string; url: string; alt: string; position: string; active: boolean };

const POSITIONS = [
  { value: "50% 50%", label: "Centro" },
  { value: "50% 0%", label: "Arriba" },
  { value: "50% 100%", label: "Abajo" },
  { value: "0% 50%", label: "Izquierda" },
  { value: "100% 50%", label: "Derecha" },
  { value: "50% 25%", label: "Centro-arriba" },
  { value: "50% 75%", label: "Centro-abajo" },
];

const NEW_SLIDE: HeroSlideDTO = { id: "", url: "", alt: "", position: "50% 50%", active: true };

export function HeroSlidesBoard({ slides }: { slides: HeroSlideDTO[] }) {
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<HeroSlideDTO | null>(null);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const visibleCount = slides.filter((slide) => slide.active).length;
  const full = slides.length >= HERO_MAX_SLIDES;

  function run(action: () => Promise<ActionResult>, onDone?: () => void) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        if (result.message) toast.success(result.message);
        onDone?.();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div>
      <PageHeader
        title="Portada del inicio"
        subtitle="Las fotos grandes detrás del título de la página de inicio. Con más de una visible, pasan solas cada pocos segundos, en este orden."
      >
        <Button onClick={() => setAdding(true)} disabled={adding || full}>
          <Plus className="h-4 w-4" /> Agregar foto
        </Button>
      </PageHeader>

      {visibleCount === 0 && (
        <Card className="mb-5 px-5 py-4 text-sm text-ink-soft">
          No hay fotos visibles: la web muestra las {HERO_FALLBACK_SLIDES.length} fotos por defecto del salón.
        </Card>
      )}
      {full && <p className="mb-5 text-sm text-ink-soft">Llegaste al máximo de {HERO_MAX_SLIDES} fotos. Eliminá una para agregar otra.</p>}

      {adding && (
        <div className="mb-5">
          <SlideCard
            slide={NEW_SLIDE}
            isNew
            onCancel={() => setAdding(false)}
            onSaved={() => setAdding(false)}
          />
        </div>
      )}

      <ul className="grid gap-5 lg:grid-cols-2">
        {slides.map((slide, index) => (
          <li key={slide.id}>
            <SlideCard
              slide={slide}
              index={index}
              toolbar={
                <div className="flex items-center gap-2">
                  <Switch
                    checked={slide.active}
                    disabled={pending}
                    label={slide.active ? "Visible" : "Oculta"}
                    onChange={(value) => run(() => toggleHeroSlideActive(slide.id, value))}
                  />
                  <IconButton label="Subir" disabled={pending || index === 0} onClick={() => run(() => reorderHeroSlide(slide.id, -1))}>
                    <ArrowUp className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Bajar" disabled={pending || index === slides.length - 1} onClick={() => run(() => reorderHeroSlide(slide.id, 1))}>
                    <ArrowDown className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Eliminar" disabled={pending} onClick={() => setDeleting(slide)} className="hover:text-[var(--color-danger)]">
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              }
            />
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="¿Eliminar esta foto?"
        message="Se quita de la portada. La podés volver a subir cuando quieras."
        confirmLabel="Eliminar"
        danger
        loading={pending}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && run(() => deleteHeroSlide(deleting.id), () => setDeleting(null))}
      />
    </div>
  );
}

function SlideCard({
  slide,
  index,
  isNew = false,
  toolbar,
  onCancel,
  onSaved,
}: {
  slide: HeroSlideDTO;
  index?: number;
  isNew?: boolean;
  toolbar?: React.ReactNode;
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const [url, setUrl] = useState(slide.url);
  const [alt, setAlt] = useState(slide.alt);
  const [position, setPosition] = useState(slide.position);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const dirty = url !== slide.url || alt !== slide.alt || position !== slide.position;
  const fieldId = slide.id || "new";

  function save() {
    const formData = new FormData();
    formData.set("url", url);
    formData.set("alt", alt);
    formData.set("position", position);
    startTransition(async () => {
      const result = await saveHeroSlide(slide.id, formData);
      if (result.ok) {
        toast.success(result.message ?? "Guardado.");
        onSaved?.();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-ink">{isNew ? "Nueva foto" : `Foto ${(index ?? 0) + 1}`}</h2>
          {!isNew && <Badge tone={slide.active ? "green" : "gray"}>{slide.active ? "Visible" : "Oculta"}</Badge>}
        </div>
        {toolbar}
      </div>

      <div className="mt-4">
        <ImageUploadField
          value={url}
          onChange={setUrl}
          folder="slots"
          label="Foto de portada"
          recommended={HERO_RECOMMENDED}
          position={position}
          previewClassName="aspect-video w-full"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_160px]">
        <div>
          <Label htmlFor={`alt-${fieldId}`}>Descripción (texto alternativo)</Label>
          <Input id={`alt-${fieldId}`} value={alt} onChange={(event) => setAlt(event.target.value)} maxLength={200} placeholder="Ej.: Salón de ventas con luminarias encendidas" />
          <Hint>Qué se ve en la foto. Lo leen Google y los lectores de pantalla.</Hint>
        </div>
        <div>
          <Label htmlFor={`pos-${fieldId}`}>Encuadre</Label>
          <Select id={`pos-${fieldId}`} value={position} onChange={(event) => setPosition(event.target.value)}>
            {POSITIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Hint>Qué parte se prioriza en pantallas angostas.</Hint>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {isNew && (
          <Button variant="ghost" onClick={onCancel} disabled={pending}>
            Cancelar
          </Button>
        )}
        <Button onClick={save} disabled={pending || !dirty || !url || !alt.trim()}>
          {pending ? (
            <>
              <Spinner /> Guardando…
            </>
          ) : isNew ? (
            "Agregar a la portada"
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </Card>
  );
}
