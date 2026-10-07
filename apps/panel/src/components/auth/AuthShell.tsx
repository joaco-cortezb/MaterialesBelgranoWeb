import Image from "next/image";

/** Marco visual de las pantallas de auth: fondo oscuro + card. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-svh place-items-center bg-sidebar px-4 py-8">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,185,40,0.25),transparent_60%)]" />
      <div className="animate-fade-up relative w-full max-w-[400px]">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/brand/isotipo.png" alt="" width={72} height={72} className="h-[72px] w-[72px]" priority />
          <span className="mt-3 text-sm font-extrabold tracking-tight text-white">MATERIALES BELGRANO</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-300">Panel de administración</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface p-7 shadow-2xl">
          <h1 className="text-xl font-extrabold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
