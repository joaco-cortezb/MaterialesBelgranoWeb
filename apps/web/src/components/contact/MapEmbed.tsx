"use client";

import { useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { SITE } from "@mb/shared";
import { buttonClassName } from "@/components/ui/Button";

const MAPS_QUERY = encodeURIComponent(`${SITE.name}, ${SITE.address.singleLine}`);
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

/** Mapa con facade: el iframe de Google recién se carga a pedido. */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-2 sm:aspect-[16/9]">
      {loaded ? (
        <iframe
          src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed&hl=es`}
          title={`Mapa: ${SITE.address.singleLine}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <FaMapLocationDot className="h-12 w-12 text-brand-600" aria-hidden />
          <p className="max-w-xs text-sm text-ink-soft">{SITE.address.singleLine}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setLoaded(true)} className={buttonClassName({ variant: "primary" })}>
              Ver mapa
            </button>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className={buttonClassName({ variant: "outline" })}>
              Abrir en Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
