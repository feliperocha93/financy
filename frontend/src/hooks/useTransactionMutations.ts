import { useMutation } from '@apollo/client/react'
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
} from '@/graphql/operations'
import type { CreateTransactionInput, UpdateTransactionInput } from '@/types/transaction'

export function useTransactionMutations(onRefetch?: () => void) {
  const [createMutation, { loading: createLoading, error: createError }] =
    useMutation(CREATE_TRANSACTION, {
      onCompleted: () => onRefetch?.(),
    })

  const [updateMutation, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_TRANSACTION, {
      onCompleted: () => onRefetch?.(),
    })

  const [deleteMutation, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_TRANSACTION, {
      onCompleted: () => onRefetch?.(),
    })

  const loading = createLoading || updateLoading || deleteLoading
  const error = createError ?? updateError ?? deleteError

  const createTransaction = async (data: CreateTransactionInput) => {
    await createMutation({ variables: { data } })
  }

  const updateTransaction = async (
    id: string,
    data: UpdateTransactionInput
  ) => {
    await updateMutation({ variables: { id, data } })
  }

  const deleteTransaction = async (id: string) => {
    await deleteMutation({ variables: { id } })
  }

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
    error,
  }
}
