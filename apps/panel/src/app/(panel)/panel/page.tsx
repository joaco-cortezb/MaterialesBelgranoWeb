import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { IMAGE_SLOTS, WHATSAPP_SOURCE_LABELS, isWhatsappSource } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/ui";
import { NAV_ITEMS } from "@/components/panel/nav";

export const dynamic = "force-dynamic";

const DAYS = 30;

async function getStats() {
  const since = new Date();
  since.setDate(since.getDate() - DAYS);
  const [brands, slots, numbers, clicksTotal, clicks30, bySource] = await Promise.all([
    prisma.brand.count({ where: { active: true } }),
    prisma.imageSlot.count(),
    prisma.whatsappNumber.count({ where: { active: true } }),
    prisma.whatsappClick.count(),
    prisma.whatsappClick.count({ where: { createdAt: { gte: since } } }),
    prisma.whatsappClick.groupBy({ by: ["source"], where: { createdAt: { gte: since } }, _count: { _all: true } }),
  ]);
  return {
    brands,
    slots,
    numbers,
    clicksTotal,
    clicks30,
    bySource: bySource
      .map((row) => ({ source: row.source, count: row._count._all }))
      .sort((a, b) => b.count - a.count),
  };
}

export default async function PanelHome() {
  let stats: Awaited<ReturnType<typeof getStats>> | null = null;
  try {
    stats = await getStats();
  } catch (error) {
    console.error("No se pudieron leer las estadísticas", error);
  }

  const maxCount = stats?.bySource[0]?.count ?? 0;

  return (
    <div>
      <PageHeader title="Inicio" subtitle="Resumen de la web y de las consultas que llegan por WhatsApp." />

      {stats === null && (
        <Card className="mb-6 px-5 py-4 text-sm text-ink-soft">
          No se pudo leer la base de datos. Verificá <code className="rounded bg-surface-2 px-1">DATABASE_URL</code> y que las migraciones estén aplicadas.
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile label={`Clics a WhatsApp (${DAYS} días)`} value={stats?.clicks30 ?? "—"} />
        <Tile label="Clics a WhatsApp (total)" value={stats?.clicksTotal ?? "—"} />
        <Tile label="Marcas activas" value={stats?.brands ?? "—"} />
        <Tile label="Imágenes cargadas" value={stats ? `${stats.slots} / ${IMAGE_SLOTS.length}` : "—"} />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
          <MessageCircle className="h-5 w-5 text-brand-700" /> De dónde salen las consultas (últimos {DAYS} días)
        </h2>
        <Card className="divide-y divide-line">
          {stats && stats.bySource.length > 0 ? (
            stats.bySource.map((row) => (
              <div key={row.source} className="flex items-center gap-4 px-5 py-3">
                <span className="w-44 shrink-0 truncate text-sm font-semibold text-ink sm:w-64">
                  {isWhatsappSource(row.source) ? WHATSAPP_SOURCE_LABELS[row.source] : row.source}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${maxCount ? (row.count / maxCount) * 100 : 0}%` }} />
                </span>
                <span className="w-10 text-right text-sm font-bold tabular-nums text-ink">{row.count}</span>
              </div>
            ))
          ) : (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">Todavía no hay clics registrados. Aparecen acá cuando alguien toca un botón de WhatsApp en la web.</p>
          )}
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-ink">Qué podés administrar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NAV_ITEMS.filter((item) => item.href !== "/panel").map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group">
                <Card className="flex items-center gap-4 p-5 transition-[transform,border-color] duration-200 group-hover:-translate-y-0.5 group-hover:border-brand-300">
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

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-5">
      <div className="text-3xl font-extrabold tracking-tight text-ink tabular-nums">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">{label}</div>
    </Card>
  );
}
