import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { TRANSACTIONS } from '@/graphql/operations'
import { useTransactions } from './useTransactions'
import type { MockedResponse } from '@apollo/client/testing'

function TestComponent() {
  const { transactions, loading, error } = useTransactions()
  if (loading) return <span>Loading...</span>
  if (error) return <span>Error: {error.message}</span>
  return (
    <ul>
      {transactions.map((t) => (
        <li key={t.id}>{t.description}</li>
      ))}
    </ul>
  )
}

const mockTransactionsData = {
  transactions: [
    {
      id: 'tx-1',
      description: 'Coffee',
      amount: 10.5,
      date: '2024-01-15',
      type: 'EXPENSE',
      categoryId: 'cat-1',
      category: {
        id: 'cat-1',
        title: 'Food',
        icon: 'utensils',
        color: '#3b82f6',
      },
    },
  ],
}

const mocks: MockedResponse[] = [
  {
    request: { query: TRANSACTIONS },
    result: { data: mockTransactionsData },
  },
]

describe('useTransactions', () => {
  it('returns loading then transactions when mock resolves', async () => {
    renderWithProviders(<TestComponent />, { mocks })
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument()
    })
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toHaveTextContent('Coffee')
  })

  it('returns empty list when mock returns empty transactions', async () => {
    const emptyMocks: MockedResponse[] = [
      {
        request: { query: TRANSACTIONS },
        result: { data: { transactions: [] } },
      },
    ]
    renderWithProviders(<TestComponent />, { mocks: emptyMocks })
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument()
    })
    expect(screen.getByRole('list')).toBeEmptyDOMElement()
  })
})
