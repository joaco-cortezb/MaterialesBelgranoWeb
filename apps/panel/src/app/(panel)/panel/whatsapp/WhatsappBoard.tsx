"use client";

import { useState, useTransition } from "react";
import { MessageCircle, MousePointerClick } from "lucide-react";
import { formatWhatsappPhone, normalizeWhatsappPhone, type WhatsappAudience } from "@mb/shared";
import { Badge, Button, Card, Hint, Input, Label, PageHeader, Spinner, Switch, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { saveWhatsappSlot } from "./actions";

export type WhatsappSlotDTO = {
  id: string;
  label: string;
  phone: string;
  message: string;
  active: boolean;
  clicks30: number;
  /** Ya existe en la base (si no, se muestra lo que usa la web por defecto). */
  saved: boolean;
};

const SLOT_INFO: Record<WhatsappAudience, { title: string; where: string }> = {
  GENERAL: {
    title: "Ventas",
    where: "Lo usan todos los botones de WhatsApp de la web y aparece primero en Contacto.",
  },
  EMPRESAS: {
    title: "Mayoristas",
    where: "Aparece en Contacto como “Mayoristas y empresas”. Si lo apagás, la web no lo muestra.",
  },
};

export function WhatsappBoard({ slots, canManage }: { slots: Record<WhatsappAudience, WhatsappSlotDTO>; canManage: boolean }) {
  return (
    <div>
      <PageHeader title="WhatsApp" subtitle="Los dos números de la web: uno para ventas y otro para mayoristas." />
      <div className="grid gap-5 lg:grid-cols-2">
        {(["GENERAL", "EMPRESAS"] as const).map((audience) => (
          <SlotCard key={audience} audience={audience} slot={slots[audience]} canManage={canManage} />
        ))}
      </div>
    </div>
  );
}

function SlotCard({ audience, slot, canManage }: { audience: WhatsappAudience; slot: WhatsappSlotDTO; canManage: boolean }) {
  const info = SLOT_INFO[audience];
  const [label, setLabel] = useState(slot.label);
  const [phone, setPhone] = useState(slot.phone);
  const [message, setMessage] = useState(slot.message);
  const [active, setActive] = useState(slot.active);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const dirty = !slot.saved || label !== slot.label || phone !== slot.phone || message !== slot.message || active !== slot.active;
  const normalized = normalizeWhatsappPhone(phone);
  const phoneValid = /^\d{10,15}$/.test(normalized);
  const isVentas = audience === "GENERAL";

  function save() {
    const formData = new FormData();
    formData.set("label", label);
    formData.set("phone", phone);
    formData.set("message", message);
    formData.set("active", active ? "on" : "");
    startTransition(async () => {
      const result = await saveWhatsappSlot(audience, formData);
      if (result.ok) toast.success(result.message ?? "Guardado.");
      else toast.error(result.error);
    });
  }

  return (
    <Card className="flex flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink">{info.title}</h2>
            <p className="text-sm text-ink-soft">{info.where}</p>
          </div>
        </div>
        {isVentas ? (
          <Badge tone="green">Siempre visible</Badge>
        ) : (
          <Switch checked={active} onChange={setActive} disabled={!canManage || pending} label={active ? "Visible en la web" : "Oculto en la web"} />
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`label-${audience}`}>Nombre que se ve</Label>
          <Input id={`label-${audience}`} value={label} onChange={(event) => setLabel(event.target.value)} maxLength={60} disabled={!canManage} />
        </div>
        <div>
          <Label htmlFor={`phone-${audience}`}>Número</Label>
          <Input
            id={`phone-${audience}`}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputMode="tel"
            placeholder="54 9 261 533 0777"
            disabled={!canManage}
            aria-invalid={phone !== "" && !phoneValid}
          />
        </div>
      </div>
      <Hint>
        {phone && phoneValid ? `Se va a ver como ${formatWhatsappPhone(normalized)}.` : "Con código de país y el 9: 54 9 261 533 0777 (sin 0 ni 15)."}
      </Hint>

      <div className="mt-4">
        <Label htmlFor={`message-${audience}`}>Mensaje precargado</Label>
        <Textarea
          id={`message-${audience}`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={300}
          rows={3}
          placeholder="Hola, vengo de la web y quiero hacer una consulta."
          disabled={!canManage}
        />
        <Hint>Lo que aparece escrito al abrir el chat.</Hint>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
          <MousePointerClick className="h-4 w-4" /> {slot.clicks30} clics en los últimos 30 días
        </span>
        {canManage && (
          <Button onClick={save} disabled={pending || !dirty || !label.trim() || !phoneValid}>
            {pending ? (
              <>
                <Spinner /> Guardando…
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}
