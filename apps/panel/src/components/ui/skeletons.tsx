import type { ReactNode } from "react";
import { Card, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

/*
 * Esqueletos de carga de cada pantalla del panel. Copian la estructura de la
 * página ya cargada (mismas grillas, columnas, proporciones y alturas de línea)
 * para que al terminar de cargar no haya saltos. Si cambia una pantalla,
 * cambiá su esqueleto acá.
 */

// ── Piezas ───────────────────────────────────────────────────

function Loading({ children }: { children: ReactNode }) {
  return (
    <div className="animate-fade-up" aria-busy="true" aria-label="Cargando">
      {children}
    </div>
  );
}

/** Un renglón de texto: ocupa el alto de la línea real y dibuja una barra más baja adentro. */
function Line({ className, bar = "h-3.5", width }: { className?: string; bar?: string; width: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Skeleton className={cn(bar, width, "max-w-full rounded-md")} />
    </div>
  );
}

/** Varios renglones de un párrafo (el último más corto). */
function Lines({ widths, className, line = "h-5", bar = "h-3" }: { widths: string[]; className?: string; line?: string; bar?: string }) {
  return (
    <div className={className}>
      {widths.map((width, index) => (
        <Line key={index} className={line} bar={bar} width={width} />
      ))}
    </div>
  );
}

/** `Label` de un campo (13 px + mb-1.5). */
function LabelLine({ width = "w-24" }: { width?: string }) {
  return <Line className="mb-1.5 h-5" bar="h-3" width={width} />;
}

/** `Hint` de un campo (texto chico, mt-1.5). */
function HintLines({ widths = ["w-11/12"], mobile = [] }: { widths?: string[]; mobile?: string[] }) {
  return (
    <div className="mt-1.5">
      <Lines widths={widths} line="h-[19.5px]" bar="h-2.5" />
      {mobile.length > 0 && <Lines widths={mobile} className="sm:hidden" line="h-[19.5px]" bar="h-2.5" />}
    </div>
  );
}

/** `Input` de 44 px. */
function InputBox() {
  return <Skeleton className="h-11 w-full rounded-xl" />;
}

/** `Switch` con texto ("Visible"/"Oculta"). */
function SwitchBox() {
  return (
    <div className="flex shrink-0 items-center gap-2 pointer-coarse:min-h-11">
      <Skeleton className="h-7 w-12 rounded-full" />
      <Skeleton className="h-3.5 w-12 rounded-md" />
    </div>
  );
}

/** `IconButton` (40 px; 44 px en táctiles). */
function IconBox() {
  return <Skeleton className="h-10 w-10 shrink-0 rounded-lg pointer-coarse:h-11 pointer-coarse:w-11" />;
}

/** Botón primario `md`. */
function ButtonBox({ className = "w-28" }: { className?: string }) {
  return <Skeleton className={cn("h-11 rounded-xl", className)} />;
}

/** `ImageUploadField` con `compactHint`: la imagen con su proporción y una línea con la medida. */
function ImageBox({ ratio, className }: { ratio: string; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Skeleton className="w-full rounded-xl" style={{ aspectRatio: ratio }} />
      <Line className="h-4" bar="h-2.5" width="w-20" />
    </div>
  );
}

/** Título de sección (`h2` text-lg) con su bajada opcional, como en Inicio y Nosotros. */
function SectionTitle({ width, subtitle }: { width: string; subtitle?: string }) {
  return subtitle ? (
    <div className="mb-4">
      <Line className="mb-1 h-7" bar="h-5" width={width} />
      <Line className="h-5" bar="h-3" width={subtitle} />
    </div>
  ) : (
    <Line className="mb-4 h-7" bar="h-5" width={width} />
  );
}

/**
 * Igual que `PageHeader`: título, bajada (en renglones de 15 px; en celular
 * entra menos por renglón) y, si hay, el botón principal (a todo el ancho en
 * celular).
 */
function HeaderSkeleton({
  title = "w-40",
  lines,
  mobileLines = [],
  action,
}: {
  title?: string;
  lines: string[];
  mobileLines?: string[];
  action?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="w-full min-w-0 max-w-2xl sm:w-auto sm:flex-1">
        <Line className="h-8 sm:h-[42px]" bar="h-7 sm:h-8" width={title} />
        <div className="mt-1.5">
          {lines.map((width, index) => (
            <Line key={index} className="h-[22px]" bar="h-3.5" width={width} />
          ))}
          {mobileLines.map((width, index) => (
            <Line key={`m${index}`} className="h-[22px] sm:hidden" bar="h-3.5" width={width} />
          ))}
        </div>
      </div>
      {action && (
        <div className="flex w-full sm:w-auto">
          <ButtonBox className={cn("w-full", action)} />
        </div>
      )}
    </div>
  );
}

// ── Inicio ───────────────────────────────────────────────────

const TILE_BORDERS = ["border-b border-r lg:border-b-0", "border-b lg:border-b-0 lg:border-r", "border-r", ""];

/** Inicio: panel de 4 indicadores con encabezado y la grilla de accesos (3 × 2). */
export function DashboardSkeleton({ shortcuts = 6 }: { shortcuts?: number }) {
  return (
    <Loading>
      <HeaderSkeleton title="w-28" lines={["w-[28rem]"]} mobileLines={["w-40"]} />

      <Card className="grid grid-cols-2 overflow-hidden lg:grid-cols-4">
        {TILE_BORDERS.map((borders, index) => (
          <div key={index} className={cn("flex min-w-0 flex-col border-line", borders)}>
            <div className="flex items-center gap-2 border-b border-line bg-bg px-4 py-2.5 sm:px-5">
              <Skeleton className="h-4 w-4 shrink-0 rounded" />
              <Line className="h-[19.5px] flex-1" bar="h-3" width="w-24" />
            </div>
            <div className="px-4 py-5 sm:px-5">
              <Skeleton className="h-[30px] w-14 rounded-md sm:h-9" />
              <Line className="mt-2 h-[17.5px]" bar="h-3" width="w-32" />
            </div>
          </div>
        ))}
      </Card>

      <section className="mt-10">
        <SectionTitle width="w-52" />
        <Card className="overflow-hidden">
          <div className="-mb-px -mr-px grid sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: shortcuts }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 border-b border-r border-line px-6 py-6">
                <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <Line className="h-6" bar="h-4" width="w-24" />
                  <Line className="h-5" bar="h-3" width="w-36" />
                </div>
                <Skeleton className="h-4 w-4 shrink-0 rounded" />
              </div>
            ))}
          </div>
        </Card>
      </section>
    </Loading>
  );
}

// ── Listas (Soluciones y Marcas) ─────────────────────────────

/** Fila de Soluciones o Marcas: miniatura, textos y (abajo en celular) interruptor + 4 botones. */
function BoardRow({ thumb, children }: { thumb: string; children: ReactNode }) {
  return (
    <Card className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4 sm:p-4">
      <Skeleton className={cn("shrink-0", thumb)} />
      <div className="min-w-0">{children}</div>
      <div className="col-span-2 flex items-center justify-between gap-1 border-t border-line pt-3 sm:col-span-1 sm:justify-end sm:gap-2 sm:border-0 sm:pt-0">
        <SwitchBox />
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <IconBox key={index} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function NameWithBadge({ name, badges }: { name: string; badges: string[] }) {
  return (
    <div className="flex h-6 items-center gap-2 overflow-hidden">
      <Skeleton className={cn("h-4 shrink-0 rounded-md", name)} />
      {badges.map((badge, index) => (
        <Skeleton key={index} className={cn("h-[22px] shrink-0 rounded-full", badge)} />
      ))}
    </div>
  );
}

const ROW_NAMES = ["w-32", "w-24", "w-40", "w-28", "w-36", "w-24"];

/** Soluciones: miniatura cuadrada, nombre + cantidad de marcas, bajada y link a la web. */
export function CategoriesSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Loading>
      <HeaderSkeleton title="w-36" lines={["w-full", "w-2/5"]} mobileLines={["w-3/4"]} action="sm:w-44" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <BoardRow key={index} thumb="h-16 w-16 rounded-lg">
            <NameWithBadge name={ROW_NAMES[index % ROW_NAMES.length]} badges={["w-16"]} />
            <Line className="mt-0.5 h-4" bar="h-2.5" width="w-64" />
            <Line className="mt-1 h-6" bar="h-2.5" width="w-32" />
          </BoardRow>
        ))}
      </div>
    </Loading>
  );
}

/** Marcas: logo apaisado, nombre + soluciones y link del catálogo. */
export function BrandsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Loading>
      <HeaderSkeleton title="w-28" lines={["w-full", "w-1/5"]} mobileLines={["w-2/3"]} action="sm:w-40" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <BoardRow key={index} thumb="h-14 w-20 rounded-lg">
            <NameWithBadge name={ROW_NAMES[index % ROW_NAMES.length]} badges={index % 2 === 0 ? ["w-20"] : ["w-20", "w-16"]} />
            <Line className="mt-0.5 h-4" bar="h-2.5" width="w-56" />
          </BoardRow>
        ))}
      </div>
    </Loading>
  );
}

// ── Portadas ─────────────────────────────────────────────────

type Size = readonly [number, number];

/** Las pestañas centradas (Inicio / Marcas / Nosotros). */
function TabsSkeleton({ widths }: { widths: string[] }) {
  return (
    <div className="mb-6 flex justify-center">
      <div className="inline-flex max-w-full gap-1 rounded-full border border-line bg-surface p-1 shadow-[0_1px_2px_rgba(36,38,31,0.05)]">
        {widths.map((width, index) => (
          <Skeleton key={index} className={cn("h-10 shrink-0 rounded-full pointer-coarse:h-11", width)} />
        ))}
      </div>
    </div>
  );
}

/** "Texto de la portada": título, bajada y botón de guardar. */
function HeroTextCardSkeleton() {
  return (
    <Card className="mb-5 p-5">
      <Line className="h-6" bar="h-4" width="w-40" />
      <div className="mt-4 grid gap-4">
        <div>
          <LabelLine width="w-12" />
          <InputBox />
          <HintLines widths={["w-full"]} mobile={["w-1/3"]} />
        </div>
        <div>
          <LabelLine width="w-28" />
          {/* Textarea de 2 renglones. */}
          <Skeleton className="h-[71px] w-full rounded-xl" />
          <HintLines widths={["w-5/6"]} mobile={["w-1/2"]} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <ButtonBox className="w-32" />
      </div>
    </Card>
  );
}

/** Una foto: "Foto N" + interruptor y 3 botones; computadora y celular del mismo alto; la ayuda abajo. */
function SlideCardSkeleton({ desktop, mobile }: { desktop: Size; mobile: Size }) {
  const columns = `${(desktop[0] / desktop[1] / (mobile[0] / mobile[1])).toFixed(3)}fr 1fr`;
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-3">
        <Line className="h-6" bar="h-4" width="w-16" />
        <div className="flex flex-wrap items-center gap-2">
          <SwitchBox />
          <IconBox />
          <IconBox />
          <IconBox />
        </div>
      </div>
      <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: columns }}>
        <div className="min-w-0">
          <LabelLine width="w-24" />
          <ImageBox ratio={`${desktop[0]} / ${desktop[1]}`} />
        </div>
        <div className="min-w-0">
          <LabelLine width="w-14" />
          <ImageBox ratio={`${mobile[0]} / ${mobile[1]}`} />
        </div>
      </div>
      <HintLines widths={["w-full", "w-2/3"]} />
    </Card>
  );
}

/**
 * Portadas: botón "Agregar foto", pestañas, línea de ayuda, texto de la
 * portada y la grilla de fotos (2 columnas en computadora). `desktop` y
 * `mobile` son las medidas de la pestaña que se abre.
 */
export function HeroSlidesSkeleton({ desktop, mobile, slides = 2 }: { desktop: Size; mobile: Size; slides?: number }) {
  return (
    <Loading>
      <HeaderSkeleton title="w-36" lines={["w-full", "w-1/3"]} mobileLines={["w-3/4"]} action="sm:w-36" />
      <TabsSkeleton widths={["w-[78px]", "w-[86px]", "w-[100px]"]} />
      <Lines widths={["w-full", "w-2/3"]} className="mx-auto mb-5 flex max-w-3xl flex-col items-center" bar="h-3" />
      <HeroTextCardSkeleton />
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: slides }).map((_, index) => (
          <SlideCardSkeleton key={index} desktop={desktop} mobile={mobile} />
        ))}
      </div>
    </Loading>
  );
}

// ── Banners ──────────────────────────────────────────────────

/** Banners: 3 tarjetas, cada una con computadora (4:1) + celular (4:3), dos campos y guardar. */
export function BannersSkeleton({ desktop, mobile, cards = 3 }: { desktop: Size; mobile: Size; cards?: number }) {
  return (
    <Loading>
      <HeaderSkeleton title="w-32" lines={["w-full", "w-full", "w-1/4"]} mobileLines={["w-full", "w-1/2"]} />
      <div className="grid gap-5">
        {Array.from({ length: cards }).map((_, index) => (
          <Card key={index} className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Line className="h-6" bar="h-4" width="w-44" />
                <Line className="mt-0.5 h-4" bar="h-2.5" width="w-64" />
              </div>
              <SwitchBox />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-[3fr_1fr]">
              <div>
                <LabelLine />
                <ImageBox ratio={`${desktop[0]} / ${desktop[1]}`} />
              </div>
              <div className="max-w-[280px] sm:max-w-none">
                <LabelLine width="w-14" />
                <ImageBox ratio={`${mobile[0]} / ${mobile[1]}`} />
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <LabelLine width="w-32" />
                <InputBox />
                <HintLines widths={["w-full", "w-1/3"]} />
              </div>
              <div>
                <LabelLine width="w-28" />
                <InputBox />
                <HintLines widths={["w-4/5"]} />
              </div>
            </div>
            <div className="mt-5 flex justify-end border-t border-line pt-4">
              <ButtonBox />
            </div>
          </Card>
        ))}
      </div>
    </Loading>
  );
}

// ── Nosotros ─────────────────────────────────────────────────

/** Nosotros: historia (texto + vista previa con el título de Portadas), 3 fotos del negocio y los 2 WhatsApp. */
export function AboutSkeleton({ photo, photos = 3 }: { photo: Size; photos?: number }) {
  return (
    <Loading>
      <HeaderSkeleton title="w-36" lines={["w-full", "w-1/2"]} mobileLines={["w-3/4"]} />

      <section>
        <SectionTitle width="w-20" />
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <Line className="h-6" bar="h-4" width="w-14" />
              <Skeleton className="h-[22px] w-20 rounded-full" />
            </div>
            <div>
              <LabelLine width="w-16" />
              {/* Textarea de 9 renglones. */}
              <Skeleton className="h-[242px] w-full rounded-xl" />
              <HintLines widths={["w-4/5"]} />
            </div>
            <div className="mt-auto flex justify-end">
              <ButtonBox />
            </div>
          </Card>
          <Card className="p-5 sm:p-6">
            <Line className="h-6" bar="h-4" width="w-28" />
            <Skeleton className="mt-4 h-[124px] w-full rounded-xl" />
            <Line className="mt-2 h-4" bar="h-2.5" width="w-56" />
            <div className="mt-5 space-y-3">
              {[["w-full", "w-full", "w-1/2"], ["w-full", "w-full", "w-2/3"], ["w-full", "w-1/3"]].map((widths, index) => (
                <Lines key={index} widths={widths} className="flex flex-col items-center" line="h-6" bar="h-3.5" />
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle width="w-40" subtitle="w-56" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: photos }).map((_, index) => (
            <Card key={index} className="flex h-full flex-col p-5">
              <Line className="h-7" bar="h-4" width="w-32" />
              <ImageBox ratio={`${photo[0]} / ${photo[1]}`} className="mt-3" />
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle width="w-24" subtitle="w-80" />
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="flex flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                  <div>
                    <Line className="h-7" bar="h-5" width="w-24" />
                    <Line className="h-5" bar="h-3" width="w-40" />
                  </div>
                </div>
                {index === 0 ? <Skeleton className="h-[22px] w-28 shrink-0 rounded-full" /> : <SwitchBox />}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <LabelLine width="w-32" />
                  <InputBox />
                </div>
                <div>
                  <LabelLine width="w-16" />
                  <InputBox />
                </div>
              </div>
              <HintLines widths={["w-4/5"]} />
              <div className="mt-4">
                <LabelLine width="w-36" />
                {/* Textarea de 3 renglones. */}
                <Skeleton className="h-[95px] w-full rounded-xl" />
                <HintLines widths={["w-full", "w-1/4"]} />
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <Line className="h-5" bar="h-3" width="w-52" />
                <ButtonBox />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </Loading>
  );
}

// ── Equipo ───────────────────────────────────────────────────

const USER_COLUMNS = "md:grid-cols-[minmax(0,1fr)_11rem_10rem_10rem]";

/** Equipo: las 2 tarjetas de roles y la tabla de personas (en celular, el rol pasa abajo). */
export function UsersSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Loading>
      <HeaderSkeleton title="w-28" lines={["w-[26rem]"]} mobileLines={["w-1/2"]} action="sm:w-44" />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="flex items-start gap-3 p-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <Line className="h-6" bar="h-4" width="w-28" />
              <Lines widths={["w-full", "w-1/2"]} className="mt-0.5" bar="h-3" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className={cn("hidden gap-4 border-b border-line bg-surface-2/60 px-5 py-3", USER_COLUMNS, "md:grid")}>
          <Line className="h-4" bar="h-2.5" width="w-16" />
          {["w-10", "w-24", "w-16"].map((width, index) => (
            <div key={index} className="flex h-4 items-center justify-center">
              <Skeleton className={cn("h-2.5 rounded-md", width)} />
            </div>
          ))}
        </div>
        <ul className="divide-y divide-line">
          {Array.from({ length: rows }).map((_, index) => (
            <li key={index} className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-4", USER_COLUMNS)}>
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <Line className="h-6" bar="h-4" width={index === 0 ? "w-36" : "w-28"} />
                  <Line className="h-5" bar="h-3" width="w-48" />
                  <Line className="h-4 md:hidden" bar="h-2.5" width="w-40" />
                </div>
              </div>
              <Skeleton className="col-span-2 row-start-2 h-11 w-full rounded-xl md:col-span-1 md:row-start-auto" />
              <div className="hidden h-5 items-center justify-center md:flex">
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
              <div className="col-start-2 row-start-1 flex justify-end gap-1.5 md:col-start-auto md:row-start-auto md:justify-center">
                <IconBox />
                <IconBox />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </Loading>
  );
}
