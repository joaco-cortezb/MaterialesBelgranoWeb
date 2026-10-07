"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, ErrorBox, Input, Label, Spinner } from "@/components/ui";
import { safePanelDestination } from "@/lib/panel-destination";
import { signInWithPassword } from "./actions";

const URL_ERRORS: Record<string, string> = {
  "sin-acceso": "Tu cuenta no tiene acceso al panel.",
  "rate-limit": "Demasiados intentos. Esperá unos minutos.",
  auth: "El enlace no es válido o ya venció.",
};

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safePanelDestination(params.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const code = params.get("error");
    return code ? (URL_ERRORS[code] ?? null) : null;
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    let navigating = false;
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      const result = await signInWithPassword(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      navigating = true;
      router.push(next);
      router.refresh();
    } catch {
      setError("Ocurrió un error. Intentá de nuevo.");
    } finally {
      if (!navigating) setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </div>
      {error && <ErrorBox>{error}</ErrorBox>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Spinner /> Ingresando…
          </>
        ) : (
          "Ingresar"
        )}
      </Button>
      <p className="pt-1 text-center text-xs text-ink-soft">¿No podés ingresar? Escribile al responsable técnico del panel.</p>
    </form>
  );
}
