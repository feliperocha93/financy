import { useMutation } from '@apollo/client/react'
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from '@/graphql/operations'
import type { CreateCategoryInput, UpdateCategoryInput } from '@/types/category'

const CATEGORY_HAS_TRANSACTIONS = 'CATEGORY_HAS_TRANSACTIONS'

function parseCategoryError(message: string): { code?: string; message: string } {
  if (message.includes('it has') && message.includes('transaction(s)')) {
    const match = message.match(/it has (\d+) transaction/)
    const count = match ? match[1] : 'N'
    return {
      code: CATEGORY_HAS_TRANSACTIONS,
      message: `Não é possível excluir: esta categoria possui ${count} transação(ões). Reatribua ou remova-as primeiro.`,
    }
  }
  return { message }
}

export function useCategoryMutations(onRefetch?: () => void) {
  const [createMutation, { loading: createLoading, error: createError }] =
    useMutation(CREATE_CATEGORY, {
      onCompleted: () => onRefetch?.(),
    })

  const [updateMutation, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_CATEGORY, {
      onCompleted: () => onRefetch?.(),
    })

  const [deleteMutation, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_CATEGORY, {
      onCompleted: () => onRefetch?.(),
    })

  const loading = createLoading || updateLoading || deleteLoading
  const error =
    createError ?? updateError ?? deleteError
  const parsedError = error
    ? parseCategoryError(error.message)
    : null

  const createCategory = async (data: CreateCategoryInput) => {
    await createMutation({ variables: { data } })
  }

  const updateCategory = async (id: string, data: UpdateCategoryInput) => {
    await updateMutation({ variables: { id, data } })
  }

  const deleteCategory = async (id: string) => {
    await deleteMutation({ variables: { id } })
  }

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
    error: parsedError,
    errorCode: parsedError?.code,
  }
}
