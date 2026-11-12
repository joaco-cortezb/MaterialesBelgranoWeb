"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, ErrorBox, Hint, Label, PasswordInput } from "@/components/ui";
import { updatePassword } from "./actions";

export function ResetForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // Se avisa antes de ir al servidor: es el error más común y el más fácil de corregir.
    if (password !== confirm) {
      setError("Las contraseñas no coinciden. Escribí la misma en los dos campos.");
      return;
    }
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
        <PasswordInput
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={10}
          autoFocus
          aria-describedby="password-hint"
        />
        <div id="password-hint">
          <Hint>Mínimo 10 caracteres y sin tu email adentro. Las contraseñas muy usadas (como “1234567890”) se rechazan.</Hint>
        </div>
      </div>
      <div>
        <Label htmlFor="confirm">Repetir contraseña</Label>
        <PasswordInput id="confirm" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
      </div>
      {error && <ErrorBox>{error}</ErrorBox>}
      <Button type="submit" size="lg" className="w-full" loading={loading} loadingText="Guardando…">
        Guardar y entrar
      </Button>
      <p className="pt-1 text-center text-xs leading-relaxed text-ink-soft">
        ¿El enlace venció? Pedile uno nuevo a un administrador o{" "}
        <Link href="/login" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
          volvé a iniciar sesión
        </Link>
        .
      </p>
    </form>
  );
}
