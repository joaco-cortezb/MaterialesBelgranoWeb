import type { ReactNode } from "react";
import { cn } from "@mb/shared";

export function Eyebrow({ children, className, light = false }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <p
      className={cn(
        "font-condensed text-sm font-semibold uppercase tracking-[0.18em]",
        light ? "text-brand-300" : "text-brand-700",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  light?: boolean;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow light={light} className="mb-3">{eyebrow}</Eyebrow>}
      <Heading
        className={cn(
          "text-balance font-extrabold tracking-tight",
          Heading === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl",
          light ? "text-white" : "text-ink-dark",
        )}
      >
        {title}
      </Heading>
      {text && (
        <p className={cn("mt-4 text-pretty text-base leading-relaxed sm:text-lg", light ? "text-white/80" : "text-ink-soft")}>
          {text}
        </p>
      )}
    </div>
  );
}
