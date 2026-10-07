import type { IconType } from "react-icons";
import {
  FaBoxOpen,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaHeadset,
  FaTruckFast,
  FaWarehouse,
} from "react-icons/fa6";
import type { Servicio } from "@mb/shared";

const ICONS: Record<Servicio["icon"], IconType> = {
  truck: FaTruckFast,
  box: FaBoxOpen,
  creditCard: FaCreditCard,
  fileInvoice: FaFileInvoiceDollar,
  warehouse: FaWarehouse,
  headset: FaHeadset,
};

export function ServicioIcon({ icon, className }: { icon: Servicio["icon"]; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden />;
}
