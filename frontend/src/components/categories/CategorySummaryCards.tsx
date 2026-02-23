import { Card, CardContent } from '@/components/ui/card'
import { Caption } from '@/components/design-system'
import { Tag, ArrowUpDown, ShoppingBag } from 'lucide-react'
import type { Category } from '@/types/category'

function getTransactionCount(cat: Category): number {
  return cat.transactions?.length ?? 0
}

export interface CategorySummaryCardsProps {
  categories: Category[]
}

export function CategorySummaryCards({ categories }: CategorySummaryCardsProps) {
  const totalCategories = categories.length
  const totalTransactions = categories.reduce(
    (sum, cat) => sum + getTransactionCount(cat),
    0
  )
  const mostUsed =
    categories.length === 0
      ? null
      : [...categories].sort(
          (a, b) => getTransactionCount(b) - getTransactionCount(a)
        )[0]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="flex flex-row items-center gap-4 pt-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
            <Tag className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalCategories}</p>
            <Caption>TOTAL DE CATEGORIAS</Caption>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-row items-center gap-4 pt-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
            <ArrowUpDown className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalTransactions}</p>
            <Caption>TOTAL DE TRANSAÇÕES</Caption>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-row items-center gap-4 pt-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
            <ShoppingBag className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {mostUsed?.title ?? '—'}
            </p>
            <Caption>CATEGORIA MAIS UTILIZADA</Caption>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
