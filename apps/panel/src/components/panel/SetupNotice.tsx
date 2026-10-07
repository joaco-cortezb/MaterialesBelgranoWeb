import { Card } from "@/components/ui";

/** Aviso cuando faltan credenciales (el proyecto compila con placeholders). */
export function SetupNotice() {
  return (
    <Card className="px-8 py-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-700">Configuración pendiente</p>
      <h1 className="text-2xl font-extrabold text-ink">Falta conectar Supabase</h1>
      <p className="mt-3 text-[15px] text-ink-soft">
        Completá <code className="rounded bg-surface-2 px-1.5 py-0.5 text-sm">.env.local</code> con <code className="rounded bg-surface-2 px-1 py-0.5">DATABASE_URL</code>,{" "}
        <code className="rounded bg-surface-2 px-1 py-0.5">NEXT_PUBLIC_SUPABASE_*</code> y <code className="rounded bg-surface-2 px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code>, corré{" "}
        <code className="rounded bg-surface-2 px-1 py-0.5">pnpm db:deploy</code> y reiniciá el servidor. Ver el README.
      </p>
    </Card>
  );
}
