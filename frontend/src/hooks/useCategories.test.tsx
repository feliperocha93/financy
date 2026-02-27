import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { CATEGORIES } from '@/graphql/operations'
import { useCategories } from './useCategories'
import type { MockedResponse } from '@apollo/client/testing'

function TestComponent() {
  const {
    categories,
    loading,
    error,
    totalCategories,
    totalTransactions,
    mostUsedCategory,
  } = useCategories()
  if (loading) return <span>Loading...</span>
  if (error) return <span>Error: {error.message}</span>
  return (
    <div>
      <span data-testid="total-categories">{totalCategories}</span>
      <span data-testid="total-transactions">{totalTransactions}</span>
      <span data-testid="most-used">
        {mostUsedCategory?.title ?? 'none'}
      </span>
      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
  )
}

const mockCategoriesData = {
  categories: [
    {
      id: 'cat-1',
      title: 'Food',
      description: 'Groceries',
      icon: 'utensils',
      color: '#3b82f6',
      transactions: [{ id: 'tx-1' }, { id: 'tx-2' }],
    },
    {
      id: 'cat-2',
      title: 'Transport',
      description: null,
      icon: 'car',
      color: '#10b981',
      transactions: [{ id: 'tx-3' }],
    },
  ],
}

const mocks: MockedResponse[] = [
  {
    request: { query: CATEGORIES },
    result: { data: mockCategoriesData },
  },
]

describe('useCategories', () => {
  it('returns loading then categories when mock resolves', async () => {
    renderWithProviders(<TestComponent />, { mocks })
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument()
    })
    expect(screen.getByRole('list')).toHaveTextContent('Food')
    expect(screen.getByRole('list')).toHaveTextContent('Transport')
  })

  it('computes totalCategories and totalTransactions', async () => {
    renderWithProviders(<TestComponent />, { mocks })
    await waitFor(() => {
      expect(screen.getByTestId('total-categories')).toHaveTextContent('2')
    })
    expect(screen.getByTestId('total-transactions')).toHaveTextContent('3')
  })

  it('sets mostUsedCategory to category with most transactions', async () => {
    renderWithProviders(<TestComponent />, { mocks })
    await waitFor(() => {
      expect(screen.getByTestId('most-used')).toHaveTextContent('Food')
    })
  })

  it('returns empty categories and null mostUsedCategory when mock returns empty', async () => {
    const emptyMocks: MockedResponse[] = [
      {
        request: { query: CATEGORIES },
        result: { data: { categories: [] } },
      },
    ]
    renderWithProviders(<TestComponent />, { mocks: emptyMocks })
    await waitFor(() => {
      expect(screen.getByTestId('total-categories')).toHaveTextContent('0')
    })
    expect(screen.getByTestId('total-transactions')).toHaveTextContent('0')
    expect(screen.getByTestId('most-used')).toHaveTextContent('none')
  })
})
