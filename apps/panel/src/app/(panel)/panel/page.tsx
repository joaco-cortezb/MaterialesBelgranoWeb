import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, LayoutGrid, MousePointerClick, Tags } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { prisma } from "@/lib/prisma";
import { Card, LoadErrorNotice, PageHeader } from "@/components/ui";
import { NAV_ITEMS } from "@/components/panel/nav";
import { requireProfile } from "@/lib/auth";
import { canViewSection } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const DAYS = 30;

async function getStats() {
  const since = new Date();
  since.setDate(since.getDate() - DAYS);
  const [brands, categories, clicksTotal, clicks30] = await Promise.all([
    prisma.brand.count({ where: { active: true } }),
    prisma.category.count({ where: { active: true } }),
    prisma.whatsappClick.count(),
    prisma.whatsappClick.count({ where: { createdAt: { gte: since } } }),
  ]);
  return { brands, categories, clicksTotal, clicks30 };
}

export default async function PanelHome() {
  const profile = await requireProfile();
  const shortcuts = NAV_ITEMS.filter((item) => item.href !== "/panel" && (!item.section || canViewSection(profile.role, item.section)));
  let stats: Awaited<ReturnType<typeof getStats>> | null = null;
  try {
    stats = await getStats();
  } catch (error) {
    console.error("No se pudieron leer las estadísticas", error);
  }

  return (
    <div>
      <PageHeader title="Inicio" subtitle="Resumen de la web y de las consultas que llegan por WhatsApp." />

      {stats === null && <LoadErrorNotice what="los números del resumen" />}

      {/* Números del resumen: un solo panel dividido en columnas con encabezado. */}
      <Card className="grid grid-cols-2 overflow-hidden lg:grid-cols-4">
        <Tile icon={<FaWhatsapp />} tone="whatsapp" value={stats?.clicks30 ?? "—"} label={`WhatsApp · ${DAYS} días`} hint="Consultas del último mes" className="border-b border-r lg:border-b-0" />
        <Tile icon={<MousePointerClick />} value={stats?.clicksTotal ?? "—"} label="WhatsApp · total" hint="Consultas desde el inicio" className="border-b lg:border-b-0 lg:border-r" />
        <Tile icon={<Tags />} value={stats?.brands ?? "—"} label="Marcas" hint="Visibles en la web" className="border-r" />
        <Tile icon={<LayoutGrid />} value={stats?.categories ?? "—"} label="Soluciones" hint="Visibles en la web" />
      </Card>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-ink">Qué podés administrar</h2>
        {/* Accesos en grilla con líneas finas: la barra de la izquierda crece y se pone verde al pasar el mouse. */}
        <Card className="overflow-hidden">
          <div className="-mb-px -mr-px grid sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-4 border-b border-r border-line px-6 py-6 transition-colors duration-200 hover:bg-brand-50 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/70 active:bg-brand-100"
              >
                <span aria-hidden="true" className="absolute inset-y-0 left-0 my-auto h-6 w-1 rounded-r-full bg-line transition-[height,background-color] duration-200 group-hover:h-10 group-hover:bg-brand" />
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bg text-ink transition-colors duration-200 group-hover:bg-brand group-hover:text-brand-ink">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                  <span className="block font-semibold text-ink">{item.label}</span>
                  <span className="block text-sm text-ink-soft">{item.description}</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-soft transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            );
          })}
          </div>
        </Card>
      </section>
    </div>
  );
}

function Tile({
  icon,
  value,
  label,
  hint,
  tone = "brand",
  className = "",
}: {
  icon: ReactNode;
  value: string | number;
  label: string;
  hint: string;
  tone?: "brand" | "whatsapp";
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col border-line ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-bg px-4 py-2.5 text-[13px] font-semibold text-ink sm:px-5">
        <span aria-hidden="true" className={`shrink-0 [&>svg]:h-4 [&>svg]:w-4 ${tone === "whatsapp" ? "text-[#128c4b]" : "text-brand-700"}`}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      <div className="px-4 py-5 sm:px-5">
        <div className="text-3xl font-extrabold leading-none tracking-tight text-ink tabular-nums sm:text-4xl">{value}</div>
        <div className="mt-2 text-sm leading-snug text-ink-soft">{hint}</div>
      </div>
    </div>
  );
}
