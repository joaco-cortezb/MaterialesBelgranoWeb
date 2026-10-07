"use client";

import { useEffect } from "react";
import { gtmConfigured, publicEnv } from "@/lib/env.public";

/**
 * Inyecta GTM después del primer paint (idle), para que no compita con el LCP.
 * Sin `NEXT_PUBLIC_GTM_ID` válido no hace absolutamente nada: es el estado
 * por defecto hasta la configuración final de analytics.
 */
export function GoogleTagManager() {
  useEffect(() => {
    if (!gtmConfigured()) return;
    const id = publicEnv.GTM_ID;

    const load = () => {
      if (document.getElementById("gtm-script")) return;
      window.dataLayer ??= [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const script = document.createElement("script");
      script.id = "gtm-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);
    };

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = window.setTimeout(load, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
