import { Card, CardContent } from '@/components/ui/card'
import { IconButton } from '@/components/ui/icon-button'
import { Body, Caption } from '@/components/design-system'
import { CategoryIcon } from '@/lib/categoryIcons'
import { CategoryPill } from './CategoryPill'
import { Pencil, Trash2 } from 'lucide-react'
import type { Category } from '@/types/category'

function getTransactionCount(cat: Category): number {
  return cat.transactions?.length ?? 0
}

export interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const count = getTransactionCount(category)
  const itemLabel = count === 1 ? 'item' : 'itens' // pt-BR

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-gray-600"
            style={{ backgroundColor: category.color ? `${category.color}20` : '#e5e7eb' }}
            aria-hidden
          >
            <CategoryIcon iconName={category.icon} size={24} />
          </div>
          <div className="flex shrink-0 gap-1">
            <IconButton
              size="sm"
              onClick={() => onEdit(category)}
              aria-label="Editar categoria"
            >
              <Pencil className="h-4 w-4" />
            </IconButton>
            <IconButton
              size="sm"
              onClick={() => onDelete(category)}
              aria-label="Excluir categoria"
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
        <Body className="mt-3 font-semibold">{category.title}</Body>
        {category.description && (
          <Caption className="mt-1 block">{category.description}</Caption>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <CategoryPill label={category.title} color={category.color} />
          <Caption className="text-muted-foreground">
            {count} {itemLabel}
          </Caption>
        </div>
      </CardContent>
    </Card>
  )
}
