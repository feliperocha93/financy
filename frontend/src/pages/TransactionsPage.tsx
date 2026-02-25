import { useState, useMemo } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { H1, Body } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { IconButton } from '@/components/ui/icon-button'
import { SelectField } from '@/components/ui/select'
import {
  PaginationPrevButton,
  PaginationNextButton,
} from '@/components/ui/pagination-button'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useTransactionMutations } from '@/hooks/useTransactionMutations'
import { TransactionFormModal, DeleteTransactionConfirm } from '@/components/transactions'
import { CategoryPill } from '@/components/categories'
import { CategoryIcon } from '@/lib/categoryIcons'
import { Pencil, Trash2 } from 'lucide-react'
import {
  type Transaction,
  type CreateTransactionInput,
  TRANSACTION_TYPE_LABELS_TABLE,
  TRANSACTION_TYPE_FILTER_OPTIONS,
  TRANSACTION_FILTER_ALL,
} from '@/types/transaction'
import { formatCurrency } from '@/lib/currency'
import { formatDateDDMMYY, PERIOD_OPTIONS, PERIOD_FILTER_ALL } from '@/lib/date'

const PAGE_SIZE = 10
const CATEGORY_FILTER_ALL = 'all'

export function TransactionsPage() {
  const { transactions, loading, error, refetch } = useTransactions()
  const { categories } = useCategories()
  const {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading: mutationLoading,
  } = useTransactionMutations(refetch)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState(TRANSACTION_FILTER_ALL)
  const [categoryFilter, setCategoryFilter] = useState(CATEGORY_FILTER_ALL)
  const [periodFilter, setPeriodFilter] = useState(PERIOD_FILTER_ALL)
  const [page, setPage] = useState(1)

  const categoryOptions = useMemo(
    () => [
      { value: CATEGORY_FILTER_ALL, label: 'Todas' },
      ...categories.map((c) => ({ value: c.id, label: c.title })),
    ],
    [categories]
  )

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        !search ||
        tx.description.toLowerCase().includes(search.toLowerCase())
      const matchType =
        typeFilter === TRANSACTION_FILTER_ALL || tx.type === typeFilter
      const matchCategory =
        categoryFilter === CATEGORY_FILTER_ALL ||
        tx.categoryId === categoryFilter
      let matchPeriod = true
      if (periodFilter && periodFilter !== PERIOD_FILTER_ALL) {
        const txDate = tx.date.startsWith('2') ? tx.date : tx.date.split('T')[0]
        matchPeriod = txDate.startsWith(periodFilter)
      }
      return matchSearch && matchType && matchCategory && matchPeriod
    })
  }, [transactions, search, typeFilter, categoryFilter, periodFilter])

  const totalFiltered = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, totalFiltered)
  const pageTransactions = filtered.slice(start, end)

  const handleCreateSubmit = async (data: CreateTransactionInput) => {
    await createTransaction(data)
    setModalOpen(false)
  }

  const handleEditSubmit = async (data: CreateTransactionInput) => {
    if (!editingTransaction) return
    await updateTransaction(editingTransaction.id, data)
    setEditingTransaction(null)
    setModalOpen(false)
  }

  const handleDeleteClick = (tx: Transaction) => {
    setTransactionToDelete(tx)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async (tx: Transaction) => {
    await deleteTransaction(tx.id)
    setDeleteConfirmOpen(false)
    setTransactionToDelete(null)
  }

  const handleEditClick = (tx: Transaction) => {
    setEditingTransaction(tx)
    setModalOpen(true)
  }

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open)
    if (!open) setEditingTransaction(null)
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <H1 className="text-xl font-semibold">Transações</H1>
            <Body className="mt-1 text-muted-foreground">
              Gerencie todas as suas transações financeiras
            </Body>
          </div>
          <Button
            className="shrink-0 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-brand-dark"
            onClick={() => {
              setEditingTransaction(null)
              setModalOpen(true)
            }}
          >
            Nova transação
          </Button>
        </div>

        {loading && <Body>Carregando...</Body>}
        {error && <p className="text-destructive">{error.message}</p>}

        {!loading && !error && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-end gap-4">
                  <Input
                    label="Busca"
                    placeholder="Buscar por descrição"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    className="max-w-xs"
                  />
                  <SelectField
                    label="Tipo"
                    placeholder="Tipo"
                    options={TRANSACTION_TYPE_FILTER_OPTIONS}
                    value={typeFilter}
                    onValueChange={(v) => {
                      setTypeFilter(v)
                      setPage(1)
                    }}
                    containerClassName="w-36"
                  />
                  <SelectField
                    label="Categoria"
                    placeholder="Categoria"
                    options={categoryOptions}
                    value={categoryFilter}
                    onValueChange={(v) => {
                      setCategoryFilter(v)
                      setPage(1)
                    }}
                    containerClassName="w-40"
                  />
                  <SelectField
                    label="Período"
                    placeholder="Período"
                    options={PERIOD_OPTIONS}
                    value={periodFilter}
                    onValueChange={(v) => {
                      setPeriodFilter(v)
                      setPage(1)
                    }}
                    containerClassName="w-44"
                  />
                </div>
              </CardContent>
            </Card>

            {transactions.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <Body className="text-center text-muted-foreground">
                    Nenhuma transação ainda.
                  </Body>
                </CardContent>
              </Card>
            ) : filtered.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <Body className="text-center text-muted-foreground">
                    Nenhuma transação encontrada com os filtros aplicados.
                  </Body>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="rounded-md border border-input">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-input bg-muted/50">
                        <th className="px-4 py-3 text-left text-xs font-light uppercase text-muted-foreground">
                          Descrição
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light uppercase text-muted-foreground">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light uppercase text-muted-foreground">
                          Categoria
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light uppercase text-muted-foreground">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light uppercase text-muted-foreground">
                          Valor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light uppercase text-muted-foreground">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageTransactions.map((tx: Transaction) => (
                        <tr
                          key={tx.id}
                          className="border-b border-input last:border-0"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-600"
                                style={{
                                  backgroundColor: tx.category?.color
                                    ? `${tx.category.color}20`
                                    : '#e5e7eb',
                                }}
                                aria-hidden
                              >
                                <CategoryIcon
                                  iconName={tx.category?.icon ?? 'Folder'}
                                  size={16}
                                  className="text-gray-500"
                                />
                              </div>
                              <span className="font-semibold text-foreground">
                                {tx.description}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {formatDateDDMMYY(tx.date)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {tx.category ? (
                              <CategoryPill
                                label={tx.category.title}
                                color={tx.category.color ?? '#9ca3af'}
                              />
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={
                                tx.type === 'EXPENSE'
                                  ? 'text-destructive'
                                  : 'text-green-600'
                              }
                            >
                              {TRANSACTION_TYPE_LABELS_TABLE[tx.type]}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-foreground">
                              {tx.type === 'EXPENSE' ? '-' : '+'} R${' '}
                              {formatCurrency(Math.abs(tx.amount))}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex shrink-0 gap-1">
                              <IconButton
                                size="sm"
                                onClick={() => handleDeleteClick(tx)}
                                aria-label="Excluir transação"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                size="sm"
                                onClick={() => handleEditClick(tx)}
                                aria-label="Editar transação"
                              >
                                <Pencil className="h-4 w-4" />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-input bg-muted/30">
                        <td
                          colSpan={6}
                          className="px-4 py-3 text-muted-foreground"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <Body className="text-muted-foreground">
                              {start + 1} a {end} | {totalFiltered} resultado
                              {totalFiltered !== 1 ? 's' : ''}
                            </Body>
                            <div className="flex items-center gap-2">
                              <Body className="text-muted-foreground">
                                Página {page} de {totalPages}
                              </Body>
                              <div className="flex items-center gap-1">
                                <PaginationPrevButton
                                  onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                  }
                                  disabled={page <= 1}
                                />
                                <PaginationNextButton
                                  onClick={() =>
                                    setPage((p) =>
                                      Math.min(totalPages, p + 1)
                                    )
                                  }
                                  disabled={page >= totalPages}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <TransactionFormModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        mode={editingTransaction ? 'edit' : 'create'}
        transaction={editingTransaction ?? null}
        onSubmit={editingTransaction ? handleEditSubmit : handleCreateSubmit}
        loading={mutationLoading}
        categories={categories}
      />

      <DeleteTransactionConfirm
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open)
          if (!open) setTransactionToDelete(null)
        }}
        transaction={transactionToDelete}
        onConfirm={handleDeleteConfirm}
        loading={mutationLoading}
      />
    </AppLayout>
  )
}
