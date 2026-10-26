import { redirect } from "next/navigation";

/** Las fotos del negocio ahora viven dentro de Nosotros (es donde se ven en la web). */
export default function ImagenesPage() {
  redirect("/panel/nosotros#fotos");
}
