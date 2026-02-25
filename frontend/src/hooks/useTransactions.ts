import { useQuery } from '@apollo/client/react'
import { TRANSACTIONS } from '@/graphql/operations'
import type { Transaction } from '@/types/transaction'

export interface TransactionsQueryData {
  transactions: Transaction[]
}

export function useTransactions() {
  const { data, loading, error, refetch } =
    useQuery<TransactionsQueryData>(TRANSACTIONS)
  const transactions = data?.transactions ?? []

  return {
    transactions,
    loading,
    error,
    refetch,
  }
}
