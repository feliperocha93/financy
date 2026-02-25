import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Minus, Plus } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconButton } from '@/components/ui/icon-button'
import { SelectField } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { formatCurrency, parseCurrency } from '@/lib/currency'
import {
  type TransactionType,
  TRANSACTION_TYPE_LABELS_MODAL,
  type CreateTransactionInput,
} from '@/types/transaction'

import type { Transaction } from '@/types/transaction'

const schema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z.string().min(1, 'Descrição é obrigatória'),
  date: z.string().min(1, 'Selecione a data'),
  amount: z.number().min(0, 'Valor não pode ser negativo'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
})

type FormData = z.infer<typeof schema>

export interface TransactionFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  transaction?: Transaction | null
  onSubmit: (data: CreateTransactionInput) => Promise<void>
  loading?: boolean
  categories: { id: string; title: string }[]
}

export function TransactionFormModal({
  open,
  onOpenChange,
  mode = 'create',
  transaction,
  onSubmit,
  loading = false,
  categories,
}: TransactionFormModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'EXPENSE',
      description: '',
      date: '',
      amount: 0,
      categoryId: '',
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset({
        type: 'EXPENSE',
        description: '',
        date: '',
        amount: 0,
        categoryId: '',
      })
      return
    }
    if (mode === 'edit' && transaction) {
      const dateStr = transaction.date.split('T')[0] ?? transaction.date
      form.reset({
        type: transaction.type,
        description: transaction.description,
        date: dateStr,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
      })
      setAmountInputStr(
        transaction.amount === 0 ? '' : `R$ ${formatCurrency(transaction.amount)}`
      )
    } else {
      setAmountInputStr('')
    }
  }, [open, mode, transaction?.id, form])

  const [amountInputStr, setAmountInputStr] = useState('')

  async function handleSubmit(values: FormData) {
    const data: CreateTransactionInput = {
      description: values.description,
      amount: values.amount,
      date: values.date,
      type: values.type as TransactionType,
      categoryId: values.categoryId,
    }
    await onSubmit(data)
    onOpenChange(false)
  }

  const selectedType = form.watch('type')
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.title }))
  const modalTitle = mode === 'edit' ? 'Editar transação' : 'Nova transação'
  const modalSubtitle =
    mode === 'edit'
      ? 'Altere os dados da transação.'
      : 'Registre sua despesa ou receita'

  return (
    <Modal open={open} onOpenChange={onOpenChange} contentClassName="p-0">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h2 className="text-xl font-semibold">{modalTitle}</h2>
            <p className="text-sm text-muted-foreground">{modalSubtitle}</p>
          </div>
          <IconButton
            size="sm"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar"
            className="shrink-0 rounded-md"
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          {/* Type: Despesa / Receita */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-muted-foreground">
              Tipo
            </label>
            <div className="flex gap-2">
              {(['EXPENSE', 'INCOME'] as const).map((type) => {
                const isExpense = type === 'EXPENSE'
                const isSelected = selectedType === type
                const Icon = isExpense ? Minus : Plus
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => form.setValue('type', type)}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-2 rounded-md border py-2.5 text-sm font-medium transition-colors',
                      isExpense
                        ? isSelected
                          ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500'
                          : 'border-input bg-background text-muted-foreground hover:border-gray-400'
                        : isSelected
                          ? 'border-gray-400 bg-gray-100 text-gray-800 ring-2 ring-gray-400'
                          : 'border-input bg-background text-muted-foreground hover:border-gray-400'
                    )}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full',
                        isExpense
                          ? isSelected
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-white'
                          : isSelected
                            ? 'bg-gray-500 text-white'
                            : 'bg-gray-300 text-white'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    {TRANSACTION_TYPE_LABELS_MODAL[type]}
                  </button>
                )
              })}
            </div>
          </div>

          <Input
            label="Descrição"
            placeholder="Ex. Almoço no restaurante"
            error={!!form.formState.errors.description}
            {...form.register('description')}
          />
          {form.formState.errors.description && (
            <p className="-mt-2 text-sm text-destructive">
              {form.formState.errors.description.message}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none text-muted-foreground">
                Data
              </label>
              <input
                type="date"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                {...form.register('date')}
              />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            <Controller
              name="amount"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium leading-none text-muted-foreground">
                    Valor
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="R$ 0,00"
                    className={cn(
                      'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
                      form.formState.errors.amount
                        ? 'border-destructive'
                        : 'border-input'
                    )}
                    value={amountInputStr}
                    onChange={(e) => {
                      const raw = e.target.value
                      setAmountInputStr(raw)
                      field.onChange(parseCurrency(raw))
                    }}
                    onBlur={() => {
                      const n = field.value
                      setAmountInputStr(
                        n === 0 ? '' : `R$ ${formatCurrency(n)}`
                      )
                      field.onBlur()
                    }}
                  />
                  {form.formState.errors.amount && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.amount.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <SelectField
                label="Categoria"
                placeholder="Selecione"
                options={categoryOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={!!form.formState.errors.categoryId}
              />
            )}
          />
          {form.formState.errors.categoryId && (
            <p className="-mt-2 text-sm text-destructive">
              {form.formState.errors.categoryId.message}
            </p>
          )}

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-brand-dark"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
