import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Car,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  Box,
  Utensils,
  PawPrint,
  Home,
  Gift,
  Dumbbell,
  Book,
  Plane,
  Mail,
  FileText,
  Folder,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Car,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  Box,
  Utensils,
  PawPrint,
  Home,
  Gift,
  Dumbbell,
  Book,
  Plane,
  Mail,
  FileText,
}

const defaultIcon = Folder

export const CATEGORY_ICON_OPTIONS = [
  { value: 'Briefcase', label: 'Bag (work)' },
  { value: 'Car', label: 'Car' },
  { value: 'HeartPulse', label: 'Heart Pulse' },
  { value: 'PiggyBank', label: 'Piggy' },
  { value: 'ShoppingCart', label: 'Shopping Cart' },
  { value: 'Ticket', label: 'Ticket' },
  { value: 'Box', label: 'Box' },
  { value: 'Utensils', label: 'Fork and Knife' },
  { value: 'PawPrint', label: 'Pet' },
  { value: 'Home', label: 'House' },
  { value: 'Gift', label: 'Gift' },
  { value: 'Dumbbell', label: 'Gym' },
  { value: 'Book', label: 'Book' },
  { value: 'Plane', label: 'Travel' },
  { value: 'Mail', label: 'Mail' },
  { value: 'FileText', label: 'Notes' },
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
