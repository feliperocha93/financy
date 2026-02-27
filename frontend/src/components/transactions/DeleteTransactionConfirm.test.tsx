import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/test-utils'
import { DeleteTransactionConfirm } from './DeleteTransactionConfirm'
import type { Transaction } from '@/types/transaction'

const mockTransaction: Transaction = {
  id: 'tx-1',
  description: 'Coffee',
  amount: 10.5,
  date: '2024-01-15',
  type: 'EXPENSE',
  categoryId: 'cat-1',
  category: { id: 'cat-1', title: 'Food', color: '#3b82f6' },
}

describe('DeleteTransactionConfirm', () => {
  it('returns null when transaction is null', () => {
    const { container } = render(
      <DeleteTransactionConfirm
        open={true}
        onOpenChange={() => {}}
        transaction={null}
        onConfirm={async () => {}}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders modal with transaction description when open', () => {
    render(
      <DeleteTransactionConfirm
        open={true}
        onOpenChange={() => {}}
        transaction={mockTransaction}
        onConfirm={async () => {}}
      />
    )
    expect(screen.getByText(/excluir transação/i)).toBeInTheDocument()
    expect(
      screen.getByText(/tem certeza que deseja excluir "coffee"/i)
    ).toBeInTheDocument()
  })

  it('calls onOpenChange(false) when Cancel is clicked', async () => {
    const onOpenChange = vi.fn()
    render(
      <DeleteTransactionConfirm
        open={true}
        onOpenChange={onOpenChange}
        transaction={mockTransaction}
        onConfirm={async () => {}}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('calls onConfirm with transaction when Excluir is clicked', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    render(
      <DeleteTransactionConfirm
        open={true}
        onOpenChange={() => {}}
        transaction={mockTransaction}
        onConfirm={onConfirm}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /^excluir$/i }))
    expect(onConfirm).toHaveBeenCalledWith(mockTransaction)
  })

  it('shows Excluindo... and disables button when loading', () => {
    render(
      <DeleteTransactionConfirm
        open={true}
        onOpenChange={() => {}}
        transaction={mockTransaction}
        onConfirm={async () => {}}
        loading={true}
      />
    )
    expect(screen.getByRole('button', { name: /excluindo/i })).toBeDisabled()
  })
})
