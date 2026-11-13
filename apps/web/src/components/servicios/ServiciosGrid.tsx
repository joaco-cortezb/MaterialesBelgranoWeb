import { SERVICIOS, cn } from "@mb/shared";
import { ServicioIcon } from "@/components/servicios/ServicioIcon";

/**
 * "Por qué elegirnos" como grilla de características con líneas finas
 * (adaptada de "Feature Section with hover effects" de Aceternity, vía
 * 21st.dev, sin dependencias): ícono, título con una barra a la izquierda que
 * crece y se pone verde al pasar el mouse, y un velo suave que sube o baja
 * según la fila. Todo alineado a la izquierda para que se lea de un vistazo.
 */
export function ServiciosGrid() {
  return (
    <ul className="mx-auto mt-8 grid max-w-6xl overflow-hidden rounded-3xl border border-line bg-surface sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICIOS.map((servicio, index) => (
        <li
          key={servicio.slug}
          id={servicio.slug}
          className={cn(
            "group relative flex flex-col border-line py-8 sm:py-10",
            // Líneas divisorias: abajo en todas menos la última fila, a la derecha entre columnas.
            index < SERVICIOS.length - 1 && "border-b",
            index >= SERVICIOS.length - 2 && "sm:border-b-0",
            index % 2 === 0 && "sm:border-r",
            index >= SERVICIOS.length - 3 ? "lg:border-b-0" : "lg:border-b",
            index % 3 === 2 ? "lg:border-r-0" : "lg:border-r",
          )}
        >
          {/* Velo al pasar el mouse: en la fila de arriba baja, en la de abajo sube. */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
              index < 3 ? "bg-gradient-to-t from-brand-50 to-transparent" : "bg-gradient-to-b from-brand-50 to-transparent",
            )}
          />
          <div className="relative mb-5 flex items-center justify-between gap-4 px-7 sm:px-9">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg text-ink-dark transition-colors duration-300 group-hover:bg-brand-500">
              <ServicioIcon icon={servicio.icon} className="h-5 w-5" />
            </span>
            <span className="text-right font-sub text-[13px] uppercase leading-tight text-brand-700">{servicio.stat}</span>
          </div>
          <h3 className="relative px-7 text-base font-bold tracking-tight text-ink-dark sm:px-9 sm:text-lg">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 my-auto h-6 w-1 rounded-r-full bg-line transition-[height,background-color] duration-200 group-hover:h-8 group-hover:bg-brand-500"
            />
            <span className="sr-only">{servicio.title}: </span>
            <span aria-hidden className="inline-block transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1.5 motion-reduce:transform-none">
              {servicio.label}
            </span>
          </h3>
          <p className="relative mt-2 max-w-xs px-7 text-pretty text-sm leading-relaxed text-ink-soft sm:px-9 sm:text-[15px]">{servicio.short}</p>
        </li>
      ))}
    </ul>
  );
}
