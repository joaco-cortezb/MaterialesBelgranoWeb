import { SITE, cn } from "@mb/shared";

const MAPS_QUERY = encodeURIComponent(`${SITE.name}, ${SITE.address.singleLine}`);
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

/** Mapa de Google (carga diferida: recién se pide al acercarse). Ocupa todo el contenedor que le pasen. */
export function MapEmbed({ className }: { className?: string }) {
  return (
    <iframe
      src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed&hl=es`}
      title={`Mapa: ${SITE.address.singleLine}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={cn("h-full w-full border-0", className)}
    />
  );
}
