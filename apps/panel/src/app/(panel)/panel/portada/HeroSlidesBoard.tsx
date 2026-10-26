"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { HERO_MAX_SLIDES, HERO_PAGE_CONFIG, HERO_PAGES, type HeroPage } from "@mb/shared";
import { Button, Card, Hint, IconButton, Input, Label, PageHeader, Spinner, Switch, Textarea } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions";
import { deleteHeroSlide, reorderHeroSlide, saveHeroSlide, saveHomeHeroText, toggleHeroSlideActive } from "./actions";

export type HeroSlideDTO = { id: string; url: string; urlMobile: string; alt: string; position: string; active: boolean };

const NEW_SLIDE: HeroSlideDTO = { id: "", url: "", urlMobile: "", alt: "", position: "50% 50%", active: true };

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

      <Tabs
        label="Página de la web"
        items={HERO_PAGES.map((item) => ({ value: item, label: HERO_PAGE_CONFIG[item].label }))}
        value={page}
        onChange={(item) => {
          setPage(item);
          setAdding(false);
        }}
      />
      <p className="mx-auto mb-5 max-w-3xl text-center text-sm text-ink-soft">{config.hint}</p>

      {page === "inicio" && <HeroTextCard value={heroText} />}

      {visibleCount === 0 && (
        <Card className="mb-5 px-5 py-4 text-sm text-ink-soft">
          No hay fotos visibles: la portada de {config.label} se ve con fondo oscuro, sin foto.
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
              // "Quitar" ya pidió confirmación en el campo de imagen.
              onRemove={() => run(() => deleteHeroSlide(slide.id))}
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

/**
 * Una foto de la portada: la versión de computadora y, opcional, una para
 * celular (otra proporción). Se guarda sola al subir cualquiera de las dos.
 * Quitar la de computadora (con confirmación) elimina la foto de la portada;
 * quitar la de celular hace que en el celular se use la de computadora.
 */
function SlideCard({
  slide,
  page,
  index,
  isNew = false,
  toolbar,
  onCancel,
  onSaved,
  onRemove,
}: {
  slide: HeroSlideDTO;
  page: HeroPage;
  index?: number;
  isNew?: boolean;
  toolbar?: React.ReactNode;
  onCancel?: () => void;
  onSaved?: () => void;
  onRemove?: () => void;
}) {
  const [url, setUrl] = useState(slide.url);
  const [urlMobile, setUrlMobile] = useState(slide.urlMobile);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const config = HERO_PAGE_CONFIG[page];
  const [dw, dh] = config.recommended;
  const [mw, mh] = config.recommendedMobile;
  // Columnas proporcionales a las dos medidas: las dos vistas previas quedan del mismo alto.
  const columns = `${((dw / dh) / (mw / mh)).toFixed(3)}fr 1fr`;

  function save(next: { url: string; urlMobile: string }) {
    if (!next.url) {
      // Sin la de computadora no hay foto: si ya existía, se elimina.
      if (slide.id) onRemove?.();
      else setUrlMobile(next.urlMobile);
      return;
    }
    const previous = { url, urlMobile };
    setUrl(next.url);
    setUrlMobile(next.urlMobile);
    const formData = new FormData();
    formData.set("page", page);
    formData.set("url", next.url);
    formData.set("urlMobile", next.urlMobile);
    formData.set("alt", slide.alt || `Portada de ${config.label} - Materiales Belgrano`);
    formData.set("position", slide.position || "50% 50%");
    startTransition(async () => {
      const result = await saveHeroSlide(slide.id, formData);
      if (result.ok) {
        toast.success(result.message ?? "Guardado.");
        onSaved?.();
      } else {
        setUrl(previous.url);
        setUrlMobile(previous.urlMobile);
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-bold text-ink">
          {isNew ? "Nueva foto" : `Foto ${(index ?? 0) + 1}`}
          {pending && <Spinner className="text-brand-700" />}
        </h2>
        {toolbar}
        {isNew && (
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={pending}>
            Cancelar
          </Button>
        )}
      </div>
      <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: columns }}>
        <div className="min-w-0">
          <Label>Computadora</Label>
          <ImageUploadField
            value={url}
            onChange={(next) => save({ url: next, urlMobile })}
            folder="slots"
            label="Foto de portada para computadora"
            recommended={config.recommended}
            compactHint
          />
        </div>
        <div className="min-w-0">
          <Label>Celular</Label>
          <ImageUploadField
            value={urlMobile}
            onChange={(next) => save({ url, urlMobile: next })}
            folder="slots"
            label="Foto de portada para celular"
            recommended={config.recommendedMobile}
            compactHint
          />
        </div>
      </div>
      <Hint>{isNew && !url ? "Subí primero la de computadora." : "La de celular es opcional: si no hay, en el celular se ve la de computadora recortada al centro."}</Hint>
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
