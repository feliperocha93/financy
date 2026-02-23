import { cn } from '@/lib/utils'

/** Picks white or dark text based on background luminance */
function getContrastColor(hex: string): string {
  const h = hex.replace('#', '')
  if (h.length !== 6) return '#111827'
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#111827' : '#ffffff'
}

export interface CategoryPillProps {
  label: string
  color: string
  className?: string
}

export function CategoryPill({ label, color, className }: CategoryPillProps) {
  const bg = color || '#e5e7eb'
  const textColor = getContrastColor(bg)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        className
      )}
      style={{ backgroundColor: bg, color: textColor }}
    >
      {label}
    </span>
  )
}
