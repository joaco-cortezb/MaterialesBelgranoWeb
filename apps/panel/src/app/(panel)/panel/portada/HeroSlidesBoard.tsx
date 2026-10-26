"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { HERO_MAX_SLIDES, HERO_PAGE_CONFIG, HERO_PAGES, type HeroPage } from "@mb/shared";
import { Button, Card, Hint, IconButton, Input, Label, PageHeader, Select, Spinner, Switch, Textarea } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions";
import { deleteHeroSlide, reorderHeroSlide, saveHeroSlide, saveHomeHeroText, toggleHeroSlideActive } from "./actions";

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

type HeroTextValue = { title: string; text: string; defaultTitle: string };

export function HeroSlidesBoard({
  slides: allSlides,
  initialPage,
  heroText,
}: {
  slides: (HeroSlideDTO & { page: string })[];
  initialPage: HeroPage;
  heroText: HeroTextValue;
}) {
  const [page, setPage] = useState<HeroPage>(initialPage);
  const slides = allSlides.filter((slide) => slide.page === page);
  const config = HERO_PAGE_CONFIG[page];
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
        title="Portadas"
        subtitle="Las fotos grandes del inicio de cada página. Con más de una visible, pasan solas cada pocos segundos, en este orden."
      >
        <Button onClick={() => setAdding(true)} disabled={adding || full}>
          <Plus className="h-4 w-4" /> Agregar foto
        </Button>
      </PageHeader>

      <div role="tablist" aria-label="Página de la web" className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-surface-2 p-1">
        {HERO_PAGES.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={page === item}
            onClick={() => {
              setPage(item);
              setAdding(false);
            }}
            className={`min-h-10 shrink-0 rounded-lg px-4 text-sm font-semibold transition-colors ${page === item ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink"}`}
          >
            {HERO_PAGE_CONFIG[item].label}
          </button>
        ))}
      </div>
      <p className="mb-5 text-sm text-ink-soft">{config.hint}</p>

      {page === "inicio" && <HeroTextCard value={heroText} />}

      {visibleCount === 0 && (
        <Card className="mb-5 px-5 py-4 text-sm text-ink-soft">
          No hay fotos visibles: la web muestra {config.fallback.length === 1 ? "una foto" : `${config.fallback.length} fotos`} por defecto del salón.
        </Card>
      )}
      {full && <p className="mb-5 text-sm text-ink-soft">Llegaste al máximo de {HERO_MAX_SLIDES} fotos. Eliminá una para agregar otra.</p>}

      <ul className="grid gap-5 lg:grid-cols-2">
        {adding && (
          <li>
            <SlideCard
              key={page}
              slide={NEW_SLIDE}
              page={page}
              isNew
              onCancel={() => setAdding(false)}
              onSaved={() => setAdding(false)}
            />
          </li>
        )}
        {slides.map((slide, index) => (
          <li key={slide.id}>
            <SlideCard
              slide={slide}
              page={page}
              index={index}
              toolbar={
                <div className="flex items-center gap-2">
                  <Switch
                    checked={slide.active}
                    disabled={pending}
                    label="Mostrar en la portada"
                    text={slide.active ? "Visible" : "Oculta"}
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
  page,
  index,
  isNew = false,
  toolbar,
  onCancel,
  onSaved,
}: {
  slide: HeroSlideDTO;
  page: HeroPage;
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
    formData.set("page", page);
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
    <Card className="flex h-full flex-col p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-ink">{isNew ? "Nueva foto" : `Foto ${(index ?? 0) + 1}`}</h2>
        {toolbar}
      </div>

      <div className="mt-4">
        <ImageUploadField
          value={url}
          onChange={setUrl}
          folder="slots"
          label="Foto de portada"
          recommended={HERO_PAGE_CONFIG[page].recommended}
          position={position}
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

      <div className="mt-auto flex justify-end gap-2 pt-4">
        {isNew && (
          <Button variant="ghost" onClick={onCancel} disabled={pending}>
            Cancelar
          </Button>
        )}
        <Button onClick={save} loading={pending} loadingText="Guardando…" disabled={!dirty || !url || !alt.trim()}>
          {isNew ? "Agregar a la portada" : "Guardar"}
        </Button>
      </div>
    </Card>
  );
}

function HeroTextCard({ value }: { value: HeroTextValue }) {
  const [title, setTitle] = useState(value.title);
  const [text, setText] = useState(value.text);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const dirty = title !== value.title || text !== value.text;

  function save() {
    const formData = new FormData();
    formData.set("title", title);
    formData.set("text", text);
    startTransition(async () => {
      const result = await saveHomeHeroText(formData);
      if (result.ok) toast.success(result.message ?? "Guardado.");
      else toast.error(result.error);
    });
  }

  return (
    <Card className="mb-5 p-5">
      <h2 className="font-bold text-ink">Texto de la portada</h2>
      <div className="mt-4 grid gap-4">
        <div>
          <Label htmlFor="hero-title">Título</Label>
          <Input id="hero-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder={value.defaultTitle} />
          <Hint>Es el texto grande de la portada del inicio.</Hint>
        </div>
        <div>
          <Label htmlFor="hero-text">Bajada (opcional)</Label>
          <Textarea id="hero-text" value={text} onChange={(event) => setText(event.target.value)} maxLength={240} rows={2} />
          <Hint>Una línea corta debajo del título. Si la borrás y guardás, la portada queda sin bajada.</Hint>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={save} disabled={pending || !dirty}>
          {pending ? (
            <>
              <Spinner /> Guardando…
            </>
          ) : (
            "Guardar texto"
          )}
        </Button>
      </div>
    </Card>
  );
}
