"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@mb/shared";

/**
 * Barra superior que se esconde al bajar (no tapa el contenido) y vuelve a
 * aparecer apenas subís, como en las otras webs. Arriba de todo siempre se ve.
 */
export function AutoHideHeader({ className, children }: { className?: string; children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const prev = lastY.current;
        if (y > prev && y > 120) setHidden(true);
        else if (y < prev - 4 || y <= 120) setHidden(false);
        lastY.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      // Si el foco del teclado entra a la barra, que se vea.
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "sticky top-0 z-40 transition-transform duration-300 ease-[var(--ease-out-strong)] motion-reduce:transition-none",
        hidden && "-translate-y-full",
        className,
      )}
    >
      {children}
    </header>
  );
}
