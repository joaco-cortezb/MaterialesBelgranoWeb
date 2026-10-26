"use client";

import { useState, useTransition } from "react";
import { splitParagraphs } from "@mb/shared";
import { Badge, Button, Card, Hint, Input, Label, Spinner, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { saveAbout } from "./actions";

export function AboutForm({ initialHeadline, initialBody, saved }: { initialHeadline: string; initialBody: string; saved: boolean }) {
  const [headline, setHeadline] = useState(initialHeadline);
  const [body, setBody] = useState(initialBody);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const dirty = !saved || headline !== initialHeadline || body !== initialBody;
  const paragraphs = splitParagraphs(body);

  function save() {
    const formData = new FormData();
    formData.set("headline", headline);
    formData.set("body", body);
    startTransition(async () => {
      const result = await saveAbout(formData);
      if (result.ok) toast.success(result.message ?? "Guardado.");
      else toast.error(result.error);
    });
  }

  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-ink">Texto</h2>
            <Badge tone={saved ? "green" : "gray"}>{saved ? "Guardado" : "Texto por defecto"}</Badge>
          </div>
          <div>
            <Label htmlFor="headline">Título</Label>
            <Input id="headline" value={headline} onChange={(event) => setHeadline(event.target.value)} maxLength={160} />
            <Hint>Va sobre la foto de portada de Nosotros.</Hint>
          </div>
          <div>
            <Label htmlFor="body">Historia</Label>
            <Textarea id="body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={1200} rows={9} />
            <Hint>Cada renglón es un párrafo. Conviene 2 o 3 párrafos cortos. {body.length}/1200</Hint>
          </div>
          <div className="mt-auto flex justify-end">
            <Button onClick={save} disabled={pending || !dirty || !headline.trim() || !body.trim()}>
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

        <Card className="p-5 sm:p-6">
          <h2 className="font-bold text-ink">Vista previa</h2>
          <div className="mt-4 overflow-hidden rounded-xl bg-sidebar px-5 py-8 text-center text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">Nosotros</p>
            <p className="mt-2 text-balance text-xl font-extrabold leading-tight">{headline || "Título"}</p>
          </div>
          <div className="mt-5 space-y-3 text-center text-[15px] leading-relaxed text-ink">
            {paragraphs.length > 0 ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p className="text-ink-soft">Sin texto.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
