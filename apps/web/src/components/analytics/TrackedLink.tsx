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
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { rel: "nofollow" })}
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
