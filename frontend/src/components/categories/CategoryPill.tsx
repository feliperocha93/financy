import { cn } from '@/lib/utils'

export interface CategoryPillProps {
  label: string
  color: string
  className?: string
}

export function CategoryPill({ label, color, className }: CategoryPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-light text-white',
        className
      )}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  )
}
