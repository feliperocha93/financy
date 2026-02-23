import { useQuery } from '@apollo/client/react'
import { CATEGORIES } from '@/graphql/operations'
import type { Category, CategoriesQueryData } from '@/types/category'

function getTransactionCount(category: Category): number {
  return category.transactions?.length ?? 0
}

export function useCategories() {
  const { data, loading, error, refetch } = useQuery<CategoriesQueryData>(CATEGORIES)
  const categories = data?.categories ?? []

  const totalCategories = categories.length
  const totalTransactions = categories.reduce(
    (sum, cat) => sum + getTransactionCount(cat),
    0
  )
  const mostUsedCategory =
    categories.length === 0
      ? null
      : [...categories].sort(
          (a, b) => getTransactionCount(b) - getTransactionCount(a)
        )[0]

  return {
    categories,
    loading,
    error,
    refetch,
    totalCategories,
    totalTransactions,
    mostUsedCategory,
  }
}
