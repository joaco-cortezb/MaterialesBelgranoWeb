"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { RUBROS } from "@mb/shared";
import { Badge, Button, Card, EmptyState, Hint, IconButton, Input, Label, PageHeader, Select, Spinner, Switch } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions";
import { deleteBrand, reorderBrand, saveBrand, toggleBrandActive } from "./actions";

export type BrandDTO = {
  id: string;
  name: string;
  logo: string;
  catalogUrl: string;
  rubroSlug: string;
  active: boolean;
};

const EMPTY: BrandDTO = { id: "", name: "", logo: "", catalogUrl: "", rubroSlug: "", active: true };

export function BrandsBoard({ brands }: { brands: BrandDTO[] }) {
  const [editing, setEditing] = useState<BrandDTO | null>(null);
  const [deleting, setDeleting] = useState<BrandDTO | null>(null);
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
      <PageHeader title="Marcas" subtitle="Logos y catálogos que se muestran en la web. El orden de acá es el orden de la grilla.">
        <Button onClick={() => setEditing({ ...EMPTY })}>
          <Plus className="h-4 w-4" /> Nueva marca
        </Button>
      </PageHeader>

      {editing && (
        <BrandForm
          key={editing.id || "new"}
          brand={editing}
          pending={pending}
          onCancel={() => setEditing(null)}
          onSubmit={(formData) => run(() => saveBrand(editing.id, formData), () => setEditing(null))}
        />
      )}

      {brands.length === 0 ? (
        <EmptyState title="Todavía no hay marcas" hint="Cargá la primera con el botón de arriba." />
      ) : (
        <ul className="space-y-3">
          {brands.map((brand, index) => (
            <li key={brand.id}>
              <Card className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-2">
                  {brand.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.logo} alt="" className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <span className="px-1 text-center text-[11px] font-semibold text-ink-soft">Sin logo</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-semibold text-ink">{brand.name}</span>
                    <Badge tone={brand.active ? "green" : "gray"}>{brand.active ? "Visible" : "Oculta"}</Badge>
                    {brand.rubroSlug && <Badge>{RUBROS.find((rubro) => rubro.slug === brand.rubroSlug)?.shortName ?? brand.rubroSlug}</Badge>}
                  </div>
                  <a href={brand.catalogUrl} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs text-ink-soft hover:text-ink">
                    <ExternalLink className="h-3 w-3 shrink-0" /> <span className="truncate">{brand.catalogUrl}</span>
                  </a>
                </div>
                <div className="hidden items-center gap-1 sm:flex">
                  <IconButton label="Subir" disabled={pending || index === 0} onClick={() => run(() => reorderBrand(brand.id, -1))}>
                    <ArrowUp className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Bajar" disabled={pending || index === brands.length - 1} onClick={() => run(() => reorderBrand(brand.id, 1))}>
                    <ArrowDown className="h-4 w-4" />
                  </IconButton>
                </div>
                <Switch checked={brand.active} label={`Mostrar ${brand.name}`} disabled={pending} onChange={(value) => run(() => toggleBrandActive(brand.id, value))} />
                <IconButton label="Editar" onClick={() => setEditing(brand)}>
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton label="Eliminar" onClick={() => setDeleting(brand)} className="hover:text-[var(--color-danger)]">
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={`¿Eliminar ${deleting?.name ?? "la marca"}?`}
        message="Desaparece de la web al instante. Si sólo querés ocultarla un tiempo, desactivala con el interruptor."
        confirmLabel="Eliminar"
        danger
        loading={pending}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && run(() => deleteBrand(deleting.id), () => setDeleting(null))}
      />
    </div>
  );
}

function BrandForm({
  brand,
  pending,
  onCancel,
  onSubmit,
}: {
  brand: BrandDTO;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  const [logo, setLogo] = useState(brand.logo);

  return (
    <Card className="mb-6 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-ink">{brand.id ? `Editar ${brand.name}` : "Nueva marca"}</h2>
      <form
        className="mt-5 grid gap-5 sm:grid-cols-[220px_1fr]"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          formData.set("logo", logo);
          onSubmit(formData);
        }}
      >
        <div>
          <Label>Logo</Label>
          <ImageUploadField value={logo} onChange={setLogo} folder="brands" label="logo" recommended={[800, 400]} objectFit="contain" previewClassName="aspect-[2/1] w-full" />
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={brand.name} required maxLength={120} autoFocus />
          </div>
          <div>
            <Label htmlFor="catalogUrl">URL del catálogo</Label>
            <Input id="catalogUrl" name="catalogUrl" type="url" inputMode="url" placeholder="https://" defaultValue={brand.catalogUrl} required />
            <Hint>Se abre en una pestaña nueva desde la web. Tiene que empezar con https://</Hint>
          </div>
          <div>
            <Label htmlFor="rubroSlug">Solución</Label>
            <Select id="rubroSlug" name="rubroSlug" defaultValue={brand.rubroSlug}>
              <option value="">Sin solución</option>
              {RUBROS.map((rubro) => (
                <option key={rubro.slug} value={rubro.slug}>
                  {rubro.name}
                </option>
              ))}
            </Select>
            <Hint>La marca aparece también en la página de esa solución.</Hint>
          </div>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-ink">
            <input type="checkbox" name="active" defaultChecked={brand.active} /> Visible en la web
          </label>
          <div className="flex flex-wrap gap-2 pt-2">
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
        </div>
      </form>
    </Card>
  );
}
