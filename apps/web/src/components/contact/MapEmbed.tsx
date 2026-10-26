import { SITE } from "@mb/shared";

const MAPS_QUERY = encodeURIComponent(`${SITE.name}, ${SITE.address.singleLine}`);
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

/** Mapa de Google siempre visible (carga diferida: recién se pide al acercarse). */
export function MapEmbed() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface-2 sm:aspect-[16/9] lg:aspect-[21/9]">
      <iframe
        src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed&hl=es`}
        title={`Mapa: ${SITE.address.singleLine}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
