"use client";

import { useState, useTransition } from "react";
import { splitParagraphs } from "@mb/shared";
import Link from "next/link";
import { Badge, Button, Card, Hint, Label, SaveNote, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { saveAbout } from "./actions";

/** Historia de Nosotros. El título de la portada se muestra en la vista previa pero se edita en Portadas. */
export function AboutForm({ headline, initialBody, saved }: { headline: string; initialBody: string; saved: boolean }) {
  const [body, setBody] = useState(initialBody);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const dirty = !saved || body !== initialBody;
  const paragraphs = splitParagraphs(body);

  function save() {
    const formData = new FormData();
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
            <h3 className="font-bold text-ink">Texto</h3>
            <Badge tone={saved ? "green" : "gray"}>{saved ? "Guardado" : "Texto por defecto"}</Badge>
          </div>
          <div>
            <Label htmlFor="body">Historia</Label>
            <Textarea id="body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={1200} rows={9} aria-describedby="body-hint" />
            <div id="body-hint">
              <Hint>
                Cada renglón (Enter) es un párrafo. Conviene 2 o 3 párrafos cortos. {body.length}/1200
              </Hint>
            </div>
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-end gap-3">
            <SaveNote dirty={dirty && saved} missing={!body.trim() ? "Falta la historia." : null} />
            <Button onClick={save} disabled={!dirty || !body.trim()} loading={pending} loadingText="Guardando…">
              Guardar
            </Button>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="font-bold text-ink">Vista previa</h3>
          <div className="mt-4 overflow-hidden rounded-xl bg-sidebar px-5 py-8 text-center text-white">
            <p className="font-sub text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">Nosotros</p>
            <p className="mt-2 text-balance text-xl font-extrabold leading-tight">{headline}</p>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            El título de la portada se cambia en{" "}
            <Link href="/panel/portada?pagina=nosotros" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              Portadas
            </Link>
            .
          </p>
          <div className="mt-5 space-y-3 text-center text-[15px] leading-relaxed text-ink">
            {paragraphs.length > 0 ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p className="text-ink-soft">Sin texto.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
