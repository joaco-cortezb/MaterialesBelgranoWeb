"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@mb/shared";

/**
 * Barra superior que se esconde al bajar (no tapa el contenido) y vuelve a
 * aparecer apenas subís, como en las otras webs. Arriba de todo siempre se ve.
 * Al tocar un link a una sección (#soluciones) se esconde y no vuelve durante
 * el desplazamiento, así la sección queda pegada arriba sin la barra encima.
 */
export function AutoHideHeader({ className, children }: { className?: string; children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const lockedUntil = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const prev = lastY.current;
        lastY.current = y;
        if (Date.now() < lockedUntil.current) return;
        if (y > prev && y > 120) setHidden(true);
        else if (y < prev - 4 || y <= 120) setHidden(false);
      });
    };
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!link) return;
      const url = new URL((link as HTMLAnchorElement).href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      lockedUntil.current = Date.now() + 1200;
      setHidden(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
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
