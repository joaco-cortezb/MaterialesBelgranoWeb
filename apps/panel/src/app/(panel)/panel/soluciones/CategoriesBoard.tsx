"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { slugify } from "@mb/shared";
import { Badge, Button, Card, EmptyState, Hint, IconButton, Input, Label, LoadErrorNotice, PageHeader, Switch, Textarea, scrollIntoViewGently } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FocalPointPicker } from "@/components/ui/FocalPointPicker";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions";
import { resolveMediaSrc } from "@/lib/media-src";
import { deleteCategory, reorderCategory, saveCategory, toggleCategoryActive } from "./actions";

export type CategoryDTO = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  /** Párrafos separados por una línea en blanco. */
  description: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  banner: string;
  bannerPosition: string;
  whatsappMessage: string;
  seoTitle: string;
  seoDescription: string;
  active: boolean;
  brands: number;
};

const EMPTY: CategoryDTO = {
  id: "",
  slug: "",
  name: "",
  summary: "",
  description: "",
  image: "",
  imageAlt: "",
  imagePosition: "50% 50%",
  banner: "",
  bannerPosition: "50% 50%",
  whatsappMessage: "",
  seoTitle: "",
  seoDescription: "",
  active: true,
  brands: 0,
};

export function CategoriesBoard({ categories, webUrl, loadError = false }: { categories: CategoryDTO[]; webUrl: string; loadError?: boolean }) {
  const [editing, setEditing] = useState<CategoryDTO | null>(null);
  const [deleting, setDeleting] = useState<CategoryDTO | null>(null);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

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
      <PageHeader title="Soluciones" subtitle="Los rubros de la web. Cada uno tiene su card en el carrusel del inicio y su propia página. El orden de acá es el del carrusel.">
        <Button onClick={() => setEditing({ ...EMPTY })}>
          <Plus className="h-4 w-4" /> Nueva solución
        </Button>
      </PageHeader>

      {loadError && <LoadErrorNotice what="las soluciones" />}

      {editing && (
        <CategoryForm
          key={editing.id || "new"}
          category={editing}
          pending={pending}
          onCancel={() => setEditing(null)}
          onSubmit={(formData) => run(() => saveCategory(editing.id, formData), () => setEditing(null))}
        />
      )}

      {categories.length === 0 ? (
        !loadError && <EmptyState title="Todavía no hay soluciones" hint="Creá la primera con “Nueva solución”." />
      ) : (
        <ul className="space-y-3">
          {categories.map((category, index) => (
            <li key={category.id}>
              <Card className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4 sm:p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                  {category.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveMediaSrc(category.image)} alt="" className="h-full w-full object-cover" style={{ objectPosition: category.imagePosition }} />
                  ) : (
                    <span className="flex h-full items-center justify-center px-1 text-center text-[11px] font-semibold text-ink-soft">Sin foto</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-semibold text-ink">{category.name}</span>
                    <Badge>
                      {category.brands} {category.brands === 1 ? "marca" : "marcas"}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">{category.summary}</p>
                  {webUrl && (
                    <a href={`${webUrl}/soluciones/${category.slug}`} target="_blank" rel="noopener noreferrer" title={`${webUrl}/soluciones/${category.slug}`} className="mt-1 inline-flex min-h-6 max-w-full items-center gap-1 truncate text-xs font-semibold text-brand-700 hover:text-brand-800">
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" /> <span className="truncate">Ver página en la web</span>
                      <span className="sr-only">(se abre en otra pestaña)</span>
                    </a>
                  )}
                </div>
                <div className="col-span-2 flex items-center justify-between gap-1 border-t border-line pt-3 sm:col-span-1 sm:justify-end sm:gap-2 sm:border-0 sm:pt-0">
                  <Switch checked={category.active} label={`Mostrar ${category.name}`} text={category.active ? "Visible" : "Oculta"} disabled={pending} onChange={(value) => run(() => toggleCategoryActive(category.id, value))} />
                  <div className="flex items-center gap-1">
                    <IconButton label="Subir" disabled={pending || index === 0} onClick={() => run(() => reorderCategory(category.id, -1))}>
                      <ArrowUp className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Bajar" disabled={pending || index === categories.length - 1} onClick={() => run(() => reorderCategory(category.id, 1))}>
                      <ArrowDown className="h-4 w-4" />
                    </IconButton>
                    <IconButton label={`Editar ${category.name}`} disabled={pending} onClick={() => setEditing(category)}>
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton label={`Eliminar ${category.name}`} disabled={pending} onClick={() => setDeleting(category)} className="hover:text-[var(--color-danger)]">
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={`¿Eliminar ${deleting?.name ?? "la solución"}?`}
        message="Desaparece del carrusel y su página deja de existir. Las marcas asociadas quedan sin solución. Si sólo querés ocultarla un tiempo, usá el interruptor."
        confirmLabel="Eliminar"
        danger
        loading={pending}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && run(() => deleteCategory(deleting.id), () => setDeleting(null))}
      />
    </div>
  );
}

function CategoryForm({
  category,
  pending,
  onCancel,
  onSubmit,
}: {
  category: CategoryDTO;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  const isNew = !category.id;
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [summary, setSummary] = useState(category.summary);
  const [image, setImage] = useState(category.image);
  const [position, setPosition] = useState(category.imagePosition);
  const [banner, setBanner] = useState(category.banner);
  const [bannerPosition, setBannerPosition] = useState(category.bannerPosition);
  const [active, setActive] = useState(category.active);
  const cardRef = useRef<HTMLDivElement>(null);

  // El formulario se abre arriba de la lista: se lleva a la vista al abrirlo.
  useEffect(() => {
    scrollIntoViewGently(cardRef.current);
  }, []);

  return (
    <Card ref={cardRef} className="mb-6 scroll-mt-24 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-ink">{isNew ? "Nueva solución" : `Editar ${category.name}`}</h2>
      <form
        className="mt-5 space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          formData.set("image", image);
          formData.set("imagePosition", position);
          formData.set("banner", banner);
          formData.set("bannerPosition", bannerPosition);
          onSubmit(formData);
        }}
      >
        <FormSection title="Lo principal">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (!slugTouched) setSlug(slugify(event.target.value));
                }}
                required
                maxLength={80}
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="slug">Dirección de la página</Label>
              <div className="flex h-11 items-center rounded-xl border border-line bg-surface-2 pl-3.5 text-sm text-ink-soft transition-[border-color,box-shadow] hover:border-brand-300 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500/25">
                /soluciones/
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(slugify(event.target.value));
                  }}
                  required
                  maxLength={80}
                  className="h-full border-0 bg-transparent pl-1 hover:border-0 focus:ring-0"
                />
              </div>
              {!isNew && <Hint>Si la cambiás, los links viejos dejan de funcionar.</Hint>}
            </div>
          </div>
          <div>
            <Label htmlFor="summary">Bajada</Label>
            <Input id="summary" name="summary" value={summary} onChange={(event) => setSummary(event.target.value)} required maxLength={160} />
            <Hint>Se ve en la card del carrusel, debajo del nombre. Una frase corta ({summary.length}/160).</Hint>
          </div>
          <div className="flex min-h-11 items-center">
            <input type="hidden" name="active" value={active ? "on" : ""} />
            <Switch checked={active} onChange={setActive} label="Visible en la web" text="Visible en la web" />
          </div>
        </FormSection>

        <FormSection title="Imágenes">
          <div className="grid gap-5 xl:grid-cols-2">
            <ImageBlock
              title="Card del carrusel"
              hint="La card vertical del inicio. En el celular también es la portada de la página."
              upload={
                <div className="w-28 shrink-0">
                  <ImageUploadField value={image} onChange={setImage} folder="categories" label="imagen de la card" recommended={[1200, 1800]} position={position} compactHint />
                </div>
              }
              picker={
                image && (
                  <FocalPointPicker
                    src={image}
                    value={position}
                    onChange={setPosition}
                    previews={[
                      { label: "Card del carrusel", aspect: "2 / 3" },
                      { label: "Portada en el celular", aspect: "7 / 8" },
                    ]}
                  />
                )
              }
            />
            <ImageBlock
              title="Banner de la página"
              hint="La portada de la página en computadora. Si no subís uno, se usa la foto de la card."
              upload={
                <div className="w-48 shrink-0 sm:w-56">
                  <ImageUploadField value={banner} onChange={setBanner} folder="categories" label="banner de la página" recommended={[2400, 900]} position={bannerPosition} compactHint />
                </div>
              }
              picker={
                banner && (
                  <FocalPointPicker
                    src={banner}
                    value={bannerPosition}
                    onChange={setBannerPosition}
                    previews={[
                      { label: "Portada en computadora", aspect: "8 / 3" },
                      { label: "Pantalla ancha", aspect: "4 / 1" },
                    ]}
                  />
                )
              }
            />
          </div>
          {/* Ya no se editan acá: se conservan los valores que tenía cada solución. */}
          <input type="hidden" name="imageAlt" value={category.imageAlt} />
        </FormSection>

        <FormSection title="Página de la solución">
          <div>
            <Label htmlFor="description">Texto</Label>
            <Textarea id="description" name="description" defaultValue={category.description} rows={7} maxLength={6000} />
            <Hint>Va debajo de la portada, antes de las marcas. Separá los párrafos con una línea en blanco. El primero tiene que explicar en dos líneas qué venden y dónde: es lo que leen Google y los buscadores con IA.</Hint>
          </div>
          <div>
            <Label htmlFor="whatsappMessage">Mensaje de WhatsApp</Label>
            <Input id="whatsappMessage" name="whatsappMessage" defaultValue={category.whatsappMessage} maxLength={500} placeholder={`Hola, vengo de la web. Quiero consultar por ${name.toLowerCase() || "…"}.`} />
            <Hint>Lo que aparece escrito al tocar “Consultar por WhatsApp” en esta página.</Hint>
          </div>
        </FormSection>

        {/* Título y descripción para Google: se conservan los cargados; si están vacíos la web usa el nombre y la bajada. */}
        <input type="hidden" name="seoTitle" value={category.seoTitle} />
        <input type="hidden" name="seoDescription" value={category.seoDescription} />

        <div className="flex flex-wrap gap-2 border-t border-line pt-5">
          <Button type="submit" loading={pending} loadingText="Guardando…">
            Guardar
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={pending}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ImageBlock({ title, hint, upload, picker }: { title: string; hint: string; upload: React.ReactNode; picker: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-line p-4">
      <div className="flex items-start gap-4">
        {upload}
        <div className="min-w-0 pt-0.5">
          <p className="text-[13px] font-semibold text-ink">{title}</p>
          <Hint>{hint}</Hint>
        </div>
      </div>
      {picker}
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">{title}</legend>
      {children}
    </fieldset>
  );
}
