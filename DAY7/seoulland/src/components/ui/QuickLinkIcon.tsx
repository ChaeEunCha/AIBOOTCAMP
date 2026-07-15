import { Gift, MapPin, Ticket, Users } from "lucide-react";
import type { QuickLink } from "@/data/quickLinks";

const iconMap = {
  map: MapPin,
  ticket: Ticket,
  gift: Gift,
  group: Users,
};

type Props = {
  icon: QuickLink["icon"];
  size?: number;
};

export default function QuickLinkIcon({ icon, size = 20 }: Props) {
  const Icon = iconMap[icon];
  return <Icon size={size} />;
}
