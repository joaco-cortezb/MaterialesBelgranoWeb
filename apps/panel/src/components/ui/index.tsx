import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Button ───────────────────────────────────────────────────

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-brand-ink hover:brightness-105 active:brightness-95 disabled:opacity-50",
  secondary: "bg-surface text-ink border border-line hover:bg-surface-2 hover:border-brand-300 disabled:opacity-50",
  danger: "bg-[var(--color-danger)] text-white hover:brightness-110 active:brightness-95 disabled:opacity-50",
  ghost: "bg-transparent text-ink-soft hover:bg-surface-2 hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-9 text-[13px] px-3 py-1.5 rounded-lg gap-1.5",
  md: "min-h-11 text-sm px-4 py-2.5 rounded-xl gap-2",
  lg: "min-h-12 text-[15px] px-5 py-3 rounded-xl gap-2",
};

const BASE =
  "inline-flex items-center justify-center font-semibold transition-[transform,background-color,filter] duration-150 select-none disabled:cursor-not-allowed active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-1";

type ButtonProps = React.ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props} />;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props} />;
}

export function BackButton({ className, children, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link className={cn("group inline-flex min-h-9 w-fit items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink", className)} {...props}>
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
      {children}
    </Link>
  );
}

/** Botón sólo-icono, cuadrado (44 px en touch). */
export function IconButton({ className, label, ...props }: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-ink-soft transition-colors hover:border-brand-300 hover:bg-surface-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60",
        className,
      )}
      {...props}
    />
  );
}

// ── Card ─────────────────────────────────────────────────────

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(36,38,31,0.05)]", className)} {...props} />;
}

// ── Fields ───────────────────────────────────────────────────

export function Label({ className, children, ...props }: React.ComponentProps<"label">) {
  return (
    <label className={cn("mb-1.5 block text-[13px] font-semibold text-ink", className)} {...props}>
      {children}
    </label>
  );
}

export function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{children}</p>;
}

const FIELD =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink transition-[border-color,box-shadow] placeholder:text-ink-soft/50 hover:border-brand-300 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500/25 disabled:cursor-not-allowed disabled:bg-surface-2";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(FIELD, className)} {...props} />;
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(FIELD, "min-h-28 resize-y leading-relaxed", className)} {...props} />;
});

export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select className={cn(FIELD, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23646464%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10", className)} {...props}>
      {children}
    </select>
  );
}

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (value: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full ring-1 ring-inset ring-line transition-colors disabled:opacity-50",
        checked ? "bg-brand" : "bg-surface-2",
      )}
    >
      <span className={cn("inline-block h-6 w-6 rounded-full bg-surface shadow transition-transform duration-150", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
  );
}

// ── Badge ────────────────────────────────────────────────────

type BadgeTone = "green" | "red" | "gray";

const TONES: Record<BadgeTone, string> = {
  green: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  red: "bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
  gray: "bg-surface-2 text-ink-soft",
};

export function Badge({ tone = "gray", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", TONES[tone])}>{children}</span>;
}

// ── Page header ──────────────────────────────────────────────

export function PageHeader({ title, subtitle, backHref, children }: { title: string; subtitle?: string; backHref?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {backHref && (
          <BackButton href={backHref} className="mb-3">
            Volver
          </BackButton>
        )}
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-[15px] text-ink-soft">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <p className="text-lg font-bold text-ink">{title}</p>
      {hint && <p className="max-w-md text-sm text-ink-soft">{hint}</p>}
      {action && <div className="mt-1">{action}</div>}
    </Card>
  );
}

// ── Loading ──────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function PageSkeleton() {
  return (
    <div className="animate-fade-up space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="space-y-3 p-5">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block h-4 w-4 shrink-0 animate-spin-smooth rounded-full border-2 border-current border-r-transparent", className)}
      role="status"
      aria-label="Cargando"
    />
  );
}

// ── Feedback ─────────────────────────────────────────────────

export function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="rounded-xl border border-[var(--color-danger)]/25 bg-[var(--color-danger-bg)] px-4 py-3 text-sm font-medium text-[var(--color-danger)]">
      {children}
    </div>
  );
}

export function SuccessBox({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className="rounded-xl border border-[var(--color-success)]/25 bg-[var(--color-success-bg)] px-4 py-3 text-sm font-medium text-[var(--color-success)]">
      {children}
    </div>
  );
}
