"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, ErrorBox, Input, Label, Spinner } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { safePanelDestination } from "@/lib/panel-destination";
import { signInWithPassword } from "./actions";

const URL_ERRORS: Record<string, string> = {
  "sin-acceso": "Tu cuenta no tiene acceso al panel.",
  "rate-limit": "Demasiados intentos. Esperá unos minutos.",
  auth: "El enlace no es válido o ya venció. Pedí uno nuevo.",
};

function readHashParams() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.hash.replace(/^#/, ""));
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safePanelDestination(params.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    if (readHashParams()?.get("error_description")) return URL_ERRORS.auth;
    const code = params.get("error");
    return code ? (URL_ERRORS[code] ?? null) : null;
  });
  // Los enlaces de invitación y recuperación de Supabase llegan con la sesión
  // en el hash (`#access_token=…&type=invite`): se activa acá y se manda a
  // elegir contraseña.
  const [processingLink, setProcessingLink] = useState(() => {
    const hash = readHashParams();
    return Boolean(hash?.get("access_token") && hash.get("refresh_token"));
  });

  useEffect(() => {
    const hash = readHashParams();
    const accessToken = hash?.get("access_token");
    const refreshToken = hash?.get("refresh_token");
    const linkType = hash?.get("type");
    if (hash?.get("error_description")) {
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }
    if (!accessToken || !refreshToken) return;

    let cancelled = false;
    async function hydrateSession() {
      const { error: sessionError } = await createClient().auth.setSession({
        access_token: accessToken!,
        refresh_token: refreshToken!,
      });
      if (cancelled) return;
      window.history.replaceState(null, "", window.location.pathname);
      if (sessionError) {
        setError("No pudimos activar el enlace. Pedí uno nuevo.");
        setProcessingLink(false);
        return;
      }
      router.replace(linkType === "invite" || linkType === "recovery" ? "/reset" : next);
      router.refresh();
    }
    void hydrateSession();
    return () => {
      cancelled = true;
    };
  }, [next, router]);

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

  if (processingLink) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 py-5 text-sm text-ink-soft">
        <Spinner />
        <span>Activando el enlace…</span>
      </div>
    );
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
      <p className="pt-1 text-center text-xs text-ink-soft">¿No podés ingresar? Pedile a un administrador que te reenvíe el enlace de acceso.</p>
    </form>
  );
}
