export type TransactionType = 'INCOME' | 'EXPENSE'

export interface TransactionCategory {
  id: string
  title: string
  icon?: string
  color?: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  type: TransactionType
  categoryId: string
  category?: TransactionCategory | null
}

export interface CreateTransactionInput {
  description: string
  amount: number
  date: string
  type: TransactionType
  categoryId: string
}

export interface UpdateTransactionInput {
  description?: string
  amount?: number
  date?: string
  type?: TransactionType
  categoryId?: string
}

export const TRANSACTION_TYPE_LABELS_TABLE: Record<TransactionType, string> = {
  INCOME: 'Entrada',
  EXPENSE: 'Saída',
}

export const TRANSACTION_TYPE_LABELS_MODAL: Record<TransactionType, string> = {
  INCOME: 'Receita',
  EXPENSE: 'Despesa',
}

/** Sentinel value for "no filter" in type select. Radix Select does not allow empty string as item value. */
export const TRANSACTION_FILTER_ALL = 'all'

export const TRANSACTION_TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: TRANSACTION_FILTER_ALL, label: 'Todo' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]
