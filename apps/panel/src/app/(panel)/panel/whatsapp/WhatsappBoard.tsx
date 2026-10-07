"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { formatWhatsappPhone, type WhatsappAudience } from "@mb/shared";
import { Badge, Button, Card, EmptyState, Hint, IconButton, Input, Label, PageHeader, Select, Spinner, Switch, Textarea } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions";
import { deleteWhatsappNumber, reorderWhatsappNumber, saveWhatsappNumber, toggleWhatsappActive } from "./actions";

export type WhatsappDTO = {
  id: string;
  label: string;
  phone: string;
  message: string;
  audience: WhatsappAudience;
  active: boolean;
  clicks30: number;
};

const AUDIENCE_LABEL: Record<WhatsappAudience, string> = { GENERAL: "General", EMPRESAS: "Empresas" };
const EMPTY: WhatsappDTO = { id: "", label: "", phone: "", message: "", audience: "GENERAL", active: true, clicks30: 0 };

export function WhatsappBoard({ numbers, canManage }: { numbers: WhatsappDTO[]; canManage: boolean }) {
  const [editing, setEditing] = useState<WhatsappDTO | null>(null);
  const [deleting, setDeleting] = useState<WhatsappDTO | null>(null);
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
      <PageHeader title="WhatsApp" subtitle="Los botones de la web usan el primer número GENERAL activo. En Contacto se muestran todos los activos.">
        {canManage && (
          <Button onClick={() => setEditing({ ...EMPTY })}>
            <Plus className="h-4 w-4" /> Nuevo número
          </Button>
        )}
      </PageHeader>

      {editing && (
        <NumberForm
          key={editing.id || "new"}
          number={editing}
          pending={pending}
          onCancel={() => setEditing(null)}
          onSubmit={(formData) => run(() => saveWhatsappNumber(editing.id, formData), () => setEditing(null))}
        />
      )}

      {numbers.length === 0 ? (
        <EmptyState title="No hay números cargados" hint="Mientras tanto la web usa el número de respaldo configurado en el código." />
      ) : (
        <ul className="space-y-3">
          {numbers.map((number, index) => (
            <li key={number.id}>
              <Card className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">{number.label}</span>
                    <Badge tone={number.active ? "green" : "gray"}>{number.active ? "Activo" : "Inactivo"}</Badge>
                    <Badge>{AUDIENCE_LABEL[number.audience]}</Badge>
                  </div>
                  <div className="mt-0.5 text-sm text-ink-soft">
                    {formatWhatsappPhone(number.phone)} · {number.clicks30} clics en 30 días
                  </div>
                  {number.message && <p className="mt-1 truncate text-xs text-ink-soft">“{number.message}”</p>}
                </div>
                {canManage && (
                  <>
                    <div className="hidden items-center gap-1 sm:flex">
                      <IconButton label="Subir" disabled={pending || index === 0} onClick={() => run(() => reorderWhatsappNumber(number.id, -1))}>
                        <ArrowUp className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="Bajar" disabled={pending || index === numbers.length - 1} onClick={() => run(() => reorderWhatsappNumber(number.id, 1))}>
                        <ArrowDown className="h-4 w-4" />
                      </IconButton>
                    </div>
                    <Switch checked={number.active} label={`Activar ${number.label}`} disabled={pending} onChange={(value) => run(() => toggleWhatsappActive(number.id, value))} />
                    <IconButton label="Editar" onClick={() => setEditing(number)}>
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Eliminar" onClick={() => setDeleting(number)} className="hover:text-[var(--color-danger)]">
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={`¿Eliminar ${deleting?.label ?? "el número"}?`}
        message="Los clics históricos se conservan sin número asociado."
        confirmLabel="Eliminar"
        danger
        loading={pending}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && run(() => deleteWhatsappNumber(deleting.id), () => setDeleting(null))}
      />
    </div>
  );
}

function NumberForm({ number, pending, onCancel, onSubmit }: { number: WhatsappDTO; pending: boolean; onCancel: () => void; onSubmit: (formData: FormData) => void }) {
  return (
    <Card className="mb-6 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-ink">{number.id ? `Editar ${number.label}` : "Nuevo número"}</h2>
      <form
        className="mt-5 grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(new FormData(event.currentTarget));
        }}
      >
        <div>
          <Label htmlFor="label">Etiqueta</Label>
          <Input id="label" name="label" defaultValue={number.label} placeholder="Ventas" required maxLength={60} autoFocus />
          <Hint>Se muestra en la página de contacto.</Hint>
        </div>
        <div>
          <Label htmlFor="phone">Número</Label>
          <Input id="phone" name="phone" inputMode="tel" defaultValue={number.phone} placeholder="54 9 261 533 0777" required />
          <Hint>Con código de país y el 9 para celulares argentinos. Sin el 0 ni el 15.</Hint>
        </div>
        <div>
          <Label htmlFor="audience">Público</Label>
          <Select id="audience" name="audience" defaultValue={number.audience}>
            <option value="GENERAL">General (botones de la web)</option>
            <option value="EMPRESAS">Empresas (sólo en Contacto)</option>
          </Select>
        </div>
        <label className="flex min-h-11 items-center gap-3 self-end text-sm font-semibold text-ink">
          <input type="checkbox" name="active" defaultChecked={number.active} /> Activo
        </label>
        <div className="sm:col-span-2">
          <Label htmlFor="message">Mensaje precargado</Label>
          <Textarea id="message" name="message" defaultValue={number.message} maxLength={500} placeholder="Hola, vengo de la web de Materiales Belgrano y quiero hacer una consulta." />
          <Hint>Lo que aparece escrito al abrir el chat. La web le agrega entre paréntesis desde qué página se hizo clic.</Hint>
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
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
