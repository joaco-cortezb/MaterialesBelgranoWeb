"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ErrorBox, Hint, Input, Label, Spinner } from "@/components/ui";
import { updatePassword } from "./actions";

export function ResetForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("password", password);
      formData.set("confirm", confirm);
      const result = await updatePassword(formData);
      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }
      router.replace("/panel");
      router.refresh();
    } catch {
      setError("Ocurrió un error. Intentá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="password">Contraseña nueva</Label>
        <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={10} autoFocus />
        <Hint>Mínimo 10 caracteres. No puede ser una contraseña que haya aparecido en filtraciones públicas.</Hint>
      </div>
      <div>
        <Label htmlFor="confirm">Repetir contraseña</Label>
        <Input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
      </div>
      {error && <ErrorBox>{error}</ErrorBox>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Spinner /> Guardando…
          </>
        ) : (
          "Guardar y entrar"
        )}
      </Button>
    </form>
  );
}
