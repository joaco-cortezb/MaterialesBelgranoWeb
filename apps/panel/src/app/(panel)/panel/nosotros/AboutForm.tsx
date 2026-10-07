"use client";

import { useState, useTransition } from "react";
import { Button, Card, Hint, Input, Label, PageHeader, Spinner, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { saveAbout } from "./actions";

export function AboutForm({ initialHeadline, initialBody }: { initialHeadline: string; initialBody: string }) {
  const [headline, setHeadline] = useState(initialHeadline);
  const [body, setBody] = useState(initialBody);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const dirty = headline !== initialHeadline || body !== initialBody;

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
      <PageHeader title="Nosotros" subtitle="El título y el texto de la página Nosotros. Si quedan vacíos, la web muestra el texto por defecto." />
      <Card className="space-y-5 p-5 sm:p-6">
        <div>
          <Label htmlFor="headline">Título</Label>
          <Input id="headline" value={headline} onChange={(event) => setHeadline(event.target.value)} maxLength={160} placeholder="Casi 10 años creciendo con la atención como diferencial" />
        </div>
        <div>
          <Label htmlFor="body">Texto</Label>
          <Textarea id="body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={6000} rows={12} placeholder="Contá la historia del negocio…" />
          <Hint>Separá los párrafos con una línea en blanco. Sin formato: la web lo muestra como texto plano.</Hint>
        </div>
        <div className="flex justify-end">
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
    </div>
  );
}
