import { permanentRedirect } from "next/navigation";
import { ROUTES } from "@mb/shared";

/** Las soluciones se muestran en el inicio; esta ruta queda por links viejos. */
export default function SolucionesPage() {
  permanentRedirect(ROUTES.rubros);
}
