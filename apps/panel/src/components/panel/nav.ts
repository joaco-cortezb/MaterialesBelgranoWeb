import type { LucideIcon } from "lucide-react";
import { BookText, GalleryHorizontalEnd, Megaphone, KeyRound, LayoutDashboard, LayoutGrid, Tags, Video } from "lucide-react";
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
  { href: "/panel", label: "Inicio", icon: LayoutDashboard, description: "Resumen de la web" },
  { href: "/panel/soluciones", label: "Soluciones", icon: LayoutGrid, description: "Rubros y sus páginas", section: "soluciones" },
  { href: "/panel/marcas", label: "Marcas", icon: Tags, description: "Logos y catálogos", section: "marcas" },
  { href: "/panel/portada", label: "Portadas", icon: GalleryHorizontalEnd, description: "Fotos de inicio, marcas y nosotros", section: "imagenes" },
  { href: "/panel/banners", label: "Banners", icon: Megaphone, description: "Banners del inicio y de marcas", section: "inicio" },
  { href: "/panel/inicio", label: "Video", icon: Video, description: "Video del inicio", section: "inicio" },
  { href: "/panel/nosotros", label: "Nosotros", icon: BookText, description: "Historia, fotos y WhatsApp", section: "nosotros" },
  { href: "/panel/usuarios", label: "Equipo", icon: KeyRound, description: "Quién entra al panel", section: "usuarios" },
];
