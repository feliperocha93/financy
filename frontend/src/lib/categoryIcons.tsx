import type { LucideIcon } from 'lucide-react'
import {
  Folder,
  ShoppingBag,
  Film,
  TrendingUp,
  ShoppingCart,
  Wallet,
  HeartPulse,
  Car,
  Lightbulb,
  Tag,
  ArrowUpDown,
  Briefcase,
  PiggyBank,
  Building,
  Gift,
  Home,
  BookOpen,
  List,
  Heart,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Folder,
  ShoppingBag,
  Film,
  Clapperboard: Film,
  TrendingUp,
  ShoppingCart,
  Wallet,
  Banknote: Wallet,
  HeartPulse,
  Stethoscope: HeartPulse,
  Car,
  Lightbulb,
  Tag,
  ArrowUpDown,
  Briefcase,
  PiggyBank,
  Building,
  Gift,
  Home,
  BookOpen,
  List,
  Heart,
}

const defaultIcon = Folder

export const CATEGORY_ICON_OPTIONS = [
  { value: 'Briefcase', label: 'Trabalho' },
  { value: 'Wallet', label: 'Carteira' },
  { value: 'Heart', label: 'Saúde / Coração' },
  { value: 'PiggyBank', label: 'Economia' },
  { value: 'ShoppingCart', label: 'Compras' },
  { value: 'Building', label: 'Empresa' },
  { value: 'Gift', label: 'Presente' },
  { value: 'Tag', label: 'Tag' },
  { value: 'ShoppingBag', label: 'Alimentação' },
  { value: 'Home', label: 'Casa' },
  { value: 'BookOpen', label: 'Educação' },
  { value: 'List', label: 'Lista' },
  { value: 'Folder', label: 'Pasta' },
  { value: 'Film', label: 'Entretenimento' },
  { value: 'TrendingUp', label: 'Investimento' },
  { value: 'HeartPulse', label: 'Saúde' },
  { value: 'Car', label: 'Transporte' },
  { value: 'Lightbulb', label: 'Utilidades' },
  { value: 'ArrowUpDown', label: 'Transações' },
] as const

export function getCategoryIcon(iconName: string): LucideIcon {
  if (!iconName || typeof iconName !== 'string') return defaultIcon
  const key = iconName.trim()
  return iconMap[key] ?? defaultIcon
}

export function CategoryIcon({
  iconName,
  className,
  size = 24,
}: {
  iconName: string
  className?: string
  size?: number
}) {
  const Icon = getCategoryIcon(iconName)
  return <Icon className={className} size={size} aria-hidden />
}
