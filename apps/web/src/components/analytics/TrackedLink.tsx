"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/gtm";

type EventParams = Record<string, string | number | boolean | undefined>;

/**
 * `<a>` que dispara un evento de GA4 al hacer clic. Es un `<a>` plano y no
 * `next/link` porque los destinos son externos o rutas de redirección
 * (`/go/...`) que no tienen sentido prefetchear.
 */
export function TrackedLink({
  href,
  event,
  params,
  external = false,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  event: string;
  params?: EventParams;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      // Todo lo que pasa por acá (WhatsApp, catálogos, tienda, banners) abre en
      // otra pestaña: la web queda abierta detrás.
      target="_blank"
      rel={external ? "noopener noreferrer" : "nofollow noopener"}
      {...rest}
      onClick={(clickEvent) => {
        trackEvent(event, params);
        rest.onClick?.(clickEvent);
      }}
    >
      {children}
    </a>
  );
}
