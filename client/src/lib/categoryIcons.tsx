import {
  UtensilsCrossed,
  ShoppingBag,
  Leaf,
  HardHat,
  MapPin,
  Wrench,
  Monitor,
  HeartPulse,
  GraduationCap,
  Truck,
  SprayCan,
  Shield,
  FileSpreadsheet,
  Scissors,
  Car,
  Mountain,
  Shirt,
  Home,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  gastronomia: UtensilsCrossed,
  comercio: ShoppingBag,
  agricultura: Leaf,
  construccion: HardHat,
  turismo: MapPin,
  oficios: Wrench,
  tecnologia: Monitor,
  salud: HeartPulse,
  educacion: GraduationCap,
  transporte: Truck,
  limpieza: SprayCan,
  seguridad: Shield,
  administracion: FileSpreadsheet,
  belleza: Scissors,
  automotriz: Car,
  mineria: Mountain,
  textil: Shirt,
  domestico: Home,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] || Briefcase;
}

// Componente helper para usar directamente en JSX
interface CategoryIconProps {
  slug: string;
  className?: string;
}

export function CategoryIcon({
  slug,
  className = "w-4 h-4",
}: CategoryIconProps) {
  const Icon = getCategoryIcon(slug);
  return <Icon className={className} />;
}
