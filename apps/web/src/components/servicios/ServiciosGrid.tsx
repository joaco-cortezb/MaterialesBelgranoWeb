import { SERVICIOS, cn } from "@mb/shared";
import { ServicioIcon } from "@/components/servicios/ServicioIcon";

/**
 * "Por qué elegirnos": grilla con líneas finas y cada celda centrada (ícono,
 * el dato corto como título y una línea de texto). Al pasar el mouse sube un velo verde muy
 * suave, el ícono se pone verde y la rayita bajo el título se estira.
 * En celular van dos por fila para que la sección no sea interminable.
 */
export function ServiciosGrid() {
  const count = SERVICIOS.length;
  return (
    <ul className="mx-auto mt-8 grid max-w-6xl grid-cols-2 overflow-hidden rounded-3xl border border-line bg-surface sm:mt-10 lg:grid-cols-3">
      {SERVICIOS.map((servicio, index) => (
        <li
          key={servicio.slug}
          id={servicio.slug}
          className={cn(
            "group relative flex flex-col items-center border-line px-3 py-7 text-center sm:px-8 sm:py-10",
            // Líneas: a la derecha entre columnas y abajo salvo en la última fila.
            index % 2 === 0 && "border-r",
            index < count - 2 && "border-b",
            index % 3 === 2 ? "lg:border-r-0" : "lg:border-r",
            index < count - 3 ? "lg:border-b" : "lg:border-b-0",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-bg text-ink-dark transition-colors duration-300 group-hover:bg-brand-500 sm:h-14 sm:w-14">
            <ServicioIcon icon={servicio.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <h3 className="relative mt-4 text-balance text-[15px] font-bold leading-snug tracking-tight text-ink-dark sm:mt-5 sm:text-lg">
            <span className="sr-only">{servicio.title}: </span>
            <span aria-hidden>{servicio.stat}</span>
          </h3>
          <span aria-hidden className="relative mt-3 h-0.5 w-6 rounded-full bg-brand-500 transition-[width] duration-300 ease-[var(--ease-out-strong)] group-hover:w-12" />
          <p className="relative mt-3 max-w-[30ch] text-pretty text-[13px] leading-relaxed text-ink-soft sm:text-[15px]">{servicio.short}</p>
        </li>
      ))}
    </ul>
  );
}
