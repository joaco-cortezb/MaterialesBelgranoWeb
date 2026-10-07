import type { LucideIcon } from "lucide-react";
import { BookText, Images, LayoutDashboard, MessageCircle, Tags, Video } from "lucide-react";
import type { PanelSection } from "@/lib/permissions";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  /** Sección de permisos. Si falta, el ítem es visible para todos. */
  section?: PanelSection;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/panel", label: "Inicio", icon: LayoutDashboard, description: "Resumen y clics a WhatsApp" },
  { href: "/panel/marcas", label: "Marcas", icon: Tags, description: "Logos y catálogos", section: "marcas" },
  { href: "/panel/imagenes", label: "Imágenes", icon: Images, description: "Fotos de la web", section: "imagenes" },
  { href: "/panel/whatsapp", label: "WhatsApp", icon: MessageCircle, description: "Números y mensajes", section: "whatsapp" },
  { href: "/panel/inicio", label: "Video", icon: Video, description: "Video del inicio", section: "inicio" },
  { href: "/panel/nosotros", label: "Nosotros", icon: BookText, description: "Texto institucional", section: "nosotros" },
];
