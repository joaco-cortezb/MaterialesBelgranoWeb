import type { IconType } from "react-icons";
import { FaBolt, FaCamera, FaLightbulb, FaScrewdriverWrench, FaWifi } from "react-icons/fa6";

const ICONS: Record<string, IconType> = {
  "materiales-electricos": FaBolt,
  iluminacion: FaLightbulb,
  "maquinas-y-herramientas": FaScrewdriverWrench,
  "dispositivos-smart": FaWifi,
  "camaras-y-videovigilancia": FaCamera,
};

export function RubroIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? FaBolt;
  return <Icon className={className} aria-hidden />;
}
