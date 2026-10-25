"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2, X } from "lucide-react";
import { slugify, type Faq } from "@mb/shared";
import { Badge, Button, Card, EmptyState, Hint, IconButton, Input, Label, PageHeader, Select, Spinner, Switch, Textarea } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions";
import { deleteCategory, reorderCategory, saveCategory, toggleCategoryActive } from "./actions";

export type CategoryDTO = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  /** Párrafos separados por una línea en blanco. */
  description: string;
  /** Una por línea. */
  subcategories: string;
  faqs: Faq[];
  image: string;
  imageAlt: string;
  imagePosition: string;
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
  subcategories: "",
  faqs: [],
  image: "",
  imageAlt: "",
  imagePosition: "50% 50%",
  whatsappMessage: "",
  seoTitle: "",
  seoDescription: "",
  active: true,
  brands: 0,
};

const POSITIONS = [
  { value: "50% 50%", label: "Centro" },
  { value: "50% 0%", label: "Arriba" },
  { value: "50% 100%", label: "Abajo" },
  { value: "0% 50%", label: "Izquierda" },
  { value: "100% 50%", label: "Derecha" },
  { value: "50% 25%", label: "Centro-arriba" },
  { value: "50% 75%", label: "Centro-abajo" },
];

export function CategoriesBoard({ categories, webUrl }: { categories: CategoryDTO[]; webUrl: string }) {
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
        <EmptyState title="Todavía no hay soluciones" hint="Creá la primera con el botón de arriba." />
      ) : (
        <ul className="space-y-3">
          {categories.map((category, index) => (
            <li key={category.id}>
              <Card className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                  {category.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={category.image.startsWith("/") ? `${webUrl}${category.image}` : category.image} alt="" className="h-full w-full object-cover" style={{ objectPosition: category.imagePosition }} />
                  ) : (
                    <span className="flex h-full items-center justify-center px-1 text-center text-[11px] font-semibold text-ink-soft">Sin foto</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-semibold text-ink">{category.name}</span>
                    <Badge tone={category.active ? "green" : "gray"}>{category.active ? "Visible" : "Oculta"}</Badge>
                    <Badge>
                      {category.brands} {category.brands === 1 ? "marca" : "marcas"}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">{category.summary}</p>
                  {webUrl && (
                    <a href={`${webUrl}/soluciones/${category.slug}`} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink">
                      <ExternalLink className="h-3 w-3" /> /soluciones/{category.slug}
                    </a>
                  )}
                </div>
                <div className="hidden items-center gap-1 sm:flex">
                  <IconButton label="Subir" disabled={pending || index === 0} onClick={() => run(() => reorderCategory(category.id, -1))}>
                    <ArrowUp className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Bajar" disabled={pending || index === categories.length - 1} onClick={() => run(() => reorderCategory(category.id, 1))}>
                    <ArrowDown className="h-4 w-4" />
                  </IconButton>
                </div>
                <Switch checked={category.active} label={`Mostrar ${category.name}`} disabled={pending} onChange={(value) => run(() => toggleCategoryActive(category.id, value))} />
                <IconButton label="Editar" onClick={() => setEditing(category)}>
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton label="Eliminar" onClick={() => setDeleting(category)} className="hover:text-[var(--color-danger)]">
                  <Trash2 className="h-4 w-4" />
                </IconButton>
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
  const [faqs, setFaqs] = useState<Faq[]>(category.faqs);
  const [seoDescription, setSeoDescription] = useState(category.seoDescription);

  function updateFaq(index: number, patch: Partial<Faq>) {
    setFaqs((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <Card className="mb-6 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-ink">{isNew ? "Nueva solución" : `Editar ${category.name}`}</h2>
      <form
        className="mt-5 space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          formData.set("image", image);
          formData.set("imagePosition", position);
          formData.set("faqs", JSON.stringify(faqs.filter((faq) => faq.question.trim() || faq.answer.trim())));
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
              <div className="flex items-center rounded-xl border border-line bg-surface-2 pl-3.5 text-sm text-ink-soft focus-within:border-brand-600">
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
                  className="border-0 bg-transparent pl-1 focus:ring-0"
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
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-ink">
            <input type="checkbox" name="active" defaultChecked={category.active} /> Visible en la web
          </label>
        </FormSection>

        <FormSection title="Imagen">
          <div className="grid gap-5 sm:grid-cols-[260px_1fr]">
            <ImageUploadField value={image} onChange={setImage} folder="categories" label="imagen de la solución" recommended={[1600, 2000]} position={position} previewClassName="aspect-[4/5] w-full" />
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageAlt">Descripción de la foto</Label>
                <Input id="imageAlt" name="imageAlt" defaultValue={category.imageAlt} maxLength={200} placeholder="Qué se ve en la foto" />
                <Hint>La leen Google y los lectores de pantalla.</Hint>
              </div>
              <div>
                <Label htmlFor="position">Encuadre</Label>
                <Select id="position" value={position} onChange={(event) => setPosition(event.target.value)}>
                  {POSITIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Hint>Las cards del carrusel son verticales: elegí qué parte de la foto se ve.</Hint>
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Página de la solución">
          <div>
            <Label htmlFor="description">Texto</Label>
            <Textarea id="description" name="description" defaultValue={category.description} rows={7} maxLength={6000} />
            <Hint>Separá los párrafos con una línea en blanco. El primero tiene que explicar en dos líneas qué venden y dónde: es lo que leen Google y los buscadores con IA.</Hint>
          </div>
          <div>
            <Label htmlFor="subcategories">Qué incluye</Label>
            <Textarea id="subcategories" name="subcategories" defaultValue={category.subcategories} rows={5} maxLength={2000} />
            <Hint>Una línea por subcategoría. Si queda vacío, el recuadro no se muestra.</Hint>
          </div>
          <div>
            <Label>Preguntas frecuentes</Label>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="rounded-xl border border-line bg-surface-2 p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <Input value={faq.question} onChange={(event) => updateFaq(index, { question: event.target.value })} placeholder="Pregunta" maxLength={200} aria-label={`Pregunta ${index + 1}`} />
                      <Textarea value={faq.answer} onChange={(event) => updateFaq(index, { answer: event.target.value })} placeholder="Respuesta directa, de dos o tres oraciones" rows={3} maxLength={1200} aria-label={`Respuesta ${index + 1}`} />
                    </div>
                    <IconButton label="Quitar pregunta" onClick={() => setFaqs((items) => items.filter((_, i) => i !== index))}>
                      <X className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              ))}
              {faqs.length < 12 && (
                <Button type="button" variant="secondary" size="sm" onClick={() => setFaqs((items) => [...items, { question: "", answer: "" }])}>
                  <Plus className="h-4 w-4" /> Agregar pregunta
                </Button>
              )}
            </div>
            <Hint>Aparecen en la página y en los resultados de Google. Si no hay ninguna, la sección no se muestra.</Hint>
          </div>
          <div>
            <Label htmlFor="whatsappMessage">Mensaje de WhatsApp</Label>
            <Input id="whatsappMessage" name="whatsappMessage" defaultValue={category.whatsappMessage} maxLength={500} placeholder={`Hola, vengo de la web. Quiero consultar por ${name.toLowerCase() || "…"}.`} />
            <Hint>Lo que aparece escrito al tocar “Consultar por WhatsApp” en esta página.</Hint>
          </div>
        </FormSection>

        <FormSection title="Google (opcional)">
          <div>
            <Label htmlFor="seoTitle">Título en Google</Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={category.seoTitle} maxLength={70} placeholder={name ? `${name} en Mendoza` : ""} />
            <Hint>Si queda vacío se usa el nombre. Conviene incluir “Mendoza”.</Hint>
          </div>
          <div>
            <Label htmlFor="seoDescription">Descripción en Google</Label>
            <Textarea id="seoDescription" name="seoDescription" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} rows={2} maxLength={160} />
            <Hint>Si queda vacía se usa la bajada ({seoDescription.length}/160).</Hint>
          </div>
        </FormSection>

        <div className="flex flex-wrap gap-2 border-t border-line pt-5">
          <Button type="submit" disabled={pending}>
            {pending ? (
              <>
                <Spinner /> Guardando…
              </>
            ) : (
              "Guardar"
            )}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={pending}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
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
