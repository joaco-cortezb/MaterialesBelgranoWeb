import type { IconType } from "react-icons";
import { FaBolt, FaCamera, FaLayerGroup, FaLightbulb, FaScrewdriverWrench, FaWifi } from "react-icons/fa6";

/** Ícono por slug conocido; las soluciones nuevas usan uno genérico. */
const ICONS: Record<string, IconType> = {
  "materiales-electricos": FaBolt,
  iluminacion: FaLightbulb,
  "maquinas-y-herramientas": FaScrewdriverWrench,
  "dispositivos-smart": FaWifi,
  "camaras-y-videovigilancia": FaCamera,
};

export function RubroIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? FaLayerGroup;
  return <Icon className={className} aria-hidden />;
}
