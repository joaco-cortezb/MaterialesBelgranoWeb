"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ErrorBox, Input, Label, Spinner } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function ResetForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < 10) {
      setError("La contraseña tiene que tener al menos 10 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const { error: updateError } = await createClient().auth.updateUser({ password });
    if (updateError) {
      setError("No se pudo guardar la contraseña. Pedí un enlace nuevo.");
      setLoading(false);
      return;
    }
    router.replace("/panel");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="password">Contraseña nueva</Label>
        <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={10} autoFocus />
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
