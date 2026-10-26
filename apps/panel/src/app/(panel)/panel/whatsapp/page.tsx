import { redirect } from "next/navigation";

/** WhatsApp ahora vive dentro de Nosotros (es la sección de Contacto de esa página). */
export default function WhatsappPage() {
  redirect("/panel/nosotros#whatsapp");
}
