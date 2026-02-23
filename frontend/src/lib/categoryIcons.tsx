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
}

const defaultIcon = Folder

export const CATEGORY_ICON_OPTIONS = [
  { value: 'Folder', label: 'Pasta' },
  { value: 'ShoppingBag', label: 'Compras / Alimentação' },
  { value: 'Film', label: 'Entretenimento' },
  { value: 'TrendingUp', label: 'Investimento' },
  { value: 'ShoppingCart', label: 'Mercado' },
  { value: 'Wallet', label: 'Salário' },
  { value: 'HeartPulse', label: 'Saúde' },
  { value: 'Car', label: 'Transporte' },
  { value: 'Lightbulb', label: 'Utilidades' },
  { value: 'Tag', label: 'Tag' },
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
