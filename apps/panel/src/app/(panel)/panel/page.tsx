import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, LayoutGrid, MousePointerClick, Tags } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/ui";
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

      {stats === null && (
        <Card className="mb-6 px-5 py-4 text-sm text-ink-soft">
          No se pudo leer la base de datos. Verificá <code className="rounded bg-surface-2 px-1">DATABASE_URL</code> y que las migraciones estén aplicadas.
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Tile icon={<FaWhatsapp />} tone="whatsapp" value={stats?.clicks30 ?? "—"} label={`Consultas por WhatsApp (${DAYS} días)`} />
        <Tile icon={<MousePointerClick />} value={stats?.clicksTotal ?? "—"} label="Consultas por WhatsApp (total)" />
        <Tile icon={<Tags />} value={stats?.brands ?? "—"} label="Marcas visibles" />
        <Tile icon={<LayoutGrid />} value={stats?.categories ?? "—"} label="Soluciones visibles" />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-ink">Qué podés administrar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group">
                <Card className="flex h-full items-center gap-4 p-5 transition-[transform,border-color] duration-200 group-hover:-translate-y-0.5 group-hover:border-brand-300">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800 transition-colors group-hover:bg-brand group-hover:text-brand-ink">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-ink">{item.label}</div>
                    <div className="truncate text-sm text-ink-soft">{item.description}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-1" />
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Tile({ icon, value, label, tone = "brand" }: { icon: ReactNode; value: string | number; label: string; tone?: "brand" | "whatsapp" }) {
  return (
    <Card className="flex h-full flex-col items-start gap-4 p-5">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5 ${tone === "whatsapp" ? "bg-[#25d366] text-white" : "bg-brand-50 text-brand-800"}`}
      >
        {icon}
      </span>
      <div>
        <div className="text-3xl font-extrabold leading-none tracking-tight text-ink tabular-nums">{value}</div>
        <div className="mt-2 text-sm leading-snug text-ink-soft">{label}</div>
      </div>
    </Card>
  );
}
