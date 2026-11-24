"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { LocateFixed } from "lucide-react";
import { cn } from "@mb/shared";
import { Button } from "@/components/ui";
import { resolveMediaSrc } from "@/lib/media-src";

export type FocalPreview = {
  /** Dónde se ve así en la web ("Card del carrusel", "En el celular"…). */
  label: string;
  /** Proporción CSS del recorte real, por ejemplo `"3 / 1"`. */
  aspect: string;
};

const CENTER = "50% 50%";

const KEY_MOVES: Record<string, readonly [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

function clamp(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** "x% y%" → { x, y }. Cualquier valor raro cae al centro. */
function parsePosition(value: string): { x: number; y: number } {
  const match = /^(\d{1,3})% (\d{1,3})%$/.exec(value.trim());
  if (!match) return { x: 50, y: 50 };
  return { x: clamp(Number(match[1])), y: clamp(Number(match[2])) };
}

/** Mismo formato que valida el panel y que la web pone en `object-position`. */
function formatPosition(point: { x: number; y: number }) {
  return `${clamp(point.x)}% ${clamp(point.y)}%`;
}

/**
 * Elige el punto de enfoque de una foto: la parte que tiene que quedar a la
 * vista cuando la web la recorta (`object-fit: cover`). Se arrastra un punto
 * sobre la foto entera y, al lado, cada miniatura muestra el recorte real de
 * un lugar de la web. Adaptado del panel de CSIR.
 */
export function FocalPointPicker({
  src,
  value,
  onChange,
  previews = [],
  className,
}: {
  src: string;
  value: string;
  onChange: (value: string) => void;
  previews?: FocalPreview[];
  className?: string;
}) {
  const point = parsePosition(value);
  const position = formatPosition(point);
  const centered = position === CENTER;
  const stageRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const url = resolveMediaSrc(src);

  function setFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    onChange(
      formatPosition({
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      }),
    );
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setFromPointer(event);
  }

  function onPointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Home") {
      event.preventDefault();
      onChange(CENTER);
      return;
    }
    const move = KEY_MOVES[event.key];
    if (!move) return;
    event.preventDefault();
    const step = event.shiftKey ? 10 : 2;
    onChange(formatPosition({ x: point.x + move[0] * step, y: point.y + move[1] * step }));
  }

  return (
    <div className={cn("rounded-2xl border border-line bg-surface-2/60 p-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-ink">Arrastrá el punto sobre lo más importante</p>
        <Button type="button" variant="ghost" size="sm" disabled={centered} onClick={() => onChange(CENTER)} className="-my-1.5 -mr-1.5">
          <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
          Centrar
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap items-start gap-4">
        <div
          ref={stageRef}
          role="group"
          tabIndex={0}
          aria-label="Punto de enfoque de la foto. Usá las flechas para moverlo e Inicio para centrarlo."
          onPointerDown={onPointerDown}
          onPointerMove={(event) => dragging && setFromPointer(event)}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onKeyDown={onKeyDown}
          className={cn(
            "relative inline-block max-w-full touch-none select-none overflow-hidden rounded-xl bg-sidebar outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            dragging ? "cursor-grabbing" : "cursor-crosshair",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" draggable={false} className="block max-h-56 w-auto max-w-full" />
          {/* Regla de los tercios: ayuda a ubicar lo importante. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }, (_, index) => (
              <span key={index} className="border border-white/15" />
            ))}
          </div>
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(35,35,35,0.55),0_4px_14px_rgba(35,35,35,0.5)]",
              !dragging && "transition-[left,top] duration-100",
            )}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </div>
        </div>

        {previews.length > 0 && (
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink">Así se ve en la web</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {previews.map((preview) => (
                <figure key={preview.label} className="min-w-0">
                  <div className="h-24 overflow-hidden rounded-lg border border-line bg-sidebar" style={{ aspectRatio: preview.aspect }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" style={{ objectPosition: position }} />
                  </div>
                  <figcaption className="mt-1 max-w-[10rem] text-[11px] leading-tight text-ink-soft">{preview.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        Enfoque en {point.x}% horizontal y {point.y}% vertical.
      </p>
    </div>
  );
}
