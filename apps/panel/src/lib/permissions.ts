import type { Role } from "@/generated/prisma";

/**
 * Permisos por sección. Fuente única para el menú lateral, el gateo de
 * páginas y el de los server actions. No es server-only a propósito: el
 * sidebar (cliente) lo usa para ocultar lo que el rol no puede ver.
 */
export type PanelSection = "marcas" | "imagenes" | "whatsapp" | "inicio" | "nosotros" | "usuarios";

export const SECTION_MANAGE_ROLES: Record<PanelSection, Role[]> = {
  marcas: ["ADMIN", "EDITOR"],
  imagenes: ["ADMIN", "EDITOR"],
  whatsapp: ["ADMIN"],
  inicio: ["ADMIN", "EDITOR"],
  nosotros: ["ADMIN", "EDITOR"],
  usuarios: ["ADMIN"],
};

export const SECTION_VIEW_ROLES: Record<PanelSection, Role[]> = {
  ...SECTION_MANAGE_ROLES,
  whatsapp: ["ADMIN", "EDITOR"],
};

export function canManageSection(role: Role, section: PanelSection): boolean {
  return SECTION_MANAGE_ROLES[section].includes(role);
}

export function canViewSection(role: Role, section: PanelSection): boolean {
  return SECTION_VIEW_ROLES[section].includes(role);
}
