import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { Body } from '@/components/design-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useTransactionMutations } from '@/hooks/useTransactionMutations'
import { TransactionFormModal } from '@/components/transactions'
import { CategoryPill } from '@/components/categories'
import { CategoryIcon } from '@/lib/categoryIcons'
import { Wallet, Plus, Minus } from 'lucide-react'
import type { Transaction } from '@/types/transaction'
import type { Category } from '@/types/category'
import { formatCurrency } from '@/lib/currency'
import { formatDateDDMMYY } from '@/lib/date'

const RECENT_COUNT = 5

function getCurrentMonthPrefix(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function useDashboardSummary(transactions: Transaction[]) {
  const currentMonth = getCurrentMonthPrefix()
  return useMemo(() => {
    let totalBalance = 0
    let monthlyIncome = 0
    let monthlyExpenses = 0
    for (const tx of transactions) {
      const datePart = tx.date.split('T')[0] ?? tx.date
      const inCurrentMonth = datePart.startsWith(currentMonth)
      if (tx.type === 'INCOME') {
        totalBalance += tx.amount
        if (inCurrentMonth) monthlyIncome += tx.amount
      } else {
        totalBalance -= tx.amount
        if (inCurrentMonth) monthlyExpenses += tx.amount
      }
    }
    return { totalBalance, monthlyIncome, monthlyExpenses }
  }, [transactions, currentMonth])
}

function useCategoryStats(transactions: Transaction[], categories: Category[]) {
  return useMemo(() => {
    const byCategory = new Map<
      string,
      { count: number; total: number; title: string; color: string }
    >()
    for (const cat of categories) {
      byCategory.set(cat.id, {
        count: 0,
        total: 0,
        title: cat.title,
        color: cat.color,
      })
    }
    for (const tx of transactions) {
      const stat = byCategory.get(tx.categoryId)
      if (stat) {
        stat.count += 1
        if (tx.type === 'EXPENSE') stat.total += tx.amount
      }
    }
    return [...byCategory.entries()]
      .map(([id, s]) => ({ id, ...s }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [transactions, categories])
}

export function DashboardPage() {
  const { transactions, loading: transactionsLoading, error: transactionsError, refetch } = useTransactions()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { createTransaction, loading: mutationLoading } = useTransactionMutations(refetch)

  const [modalOpen, setModalOpen] = useState(false)

  const { totalBalance, monthlyIncome, monthlyExpenses } = useDashboardSummary(transactions)
  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => (b.date.localeCompare(a.date)))
        .slice(0, RECENT_COUNT),
    [transactions]
  )
  const categoryStats = useCategoryStats(transactions, categories)

  const loading = transactionsLoading
  const error = transactionsError

  const handleCreateSubmit = async (data: Parameters<typeof createTransaction>[0]) => {
    await createTransaction(data)
    setModalOpen(false)
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-start gap-2 space-y-0 pb-2">
              <Wallet className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                SALDO TOTAL
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <Body className="text-2xl font-semibold text-muted-foreground">
                  Carregando...
                </Body>
              ) : (
                <Body className="text-2xl font-semibold text-foreground">
                  R$ {formatCurrency(Math.abs(totalBalance))}
                </Body>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-start gap-2 space-y-0 pb-2">
              <Plus className="h-5 w-5 shrink-0 text-green-600" aria-hidden />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                RECEITAS DO MÊS
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <Body className="text-2xl font-semibold text-muted-foreground">
                  Carregando...
                </Body>
              ) : (
                <Body className="text-2xl font-semibold text-foreground">
                  R$ {formatCurrency(monthlyIncome)}
                </Body>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-start gap-2 space-y-0 pb-2">
              <Minus className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                DESPESAS DO MÊS
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <Body className="text-2xl font-semibold text-muted-foreground">
                  Carregando...
                </Body>
              ) : (
                <Body className="text-2xl font-semibold text-foreground">
                  R$ {formatCurrency(monthlyExpenses)}
                </Body>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Two columns: Recent transactions (2/3) | Categories (1/3) */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Recent transactions - 2/3 */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="font-light text-gray-500">TRANSAÇÕES RECENTES</span>
                  <Link
                    to="/transactions"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Ver todas &gt;
                  </Link>
                </div>
                {loading && (
                  <div className="py-8 text-center">
                    <Body className="text-muted-foreground">Carregando...</Body>
                  </div>
                )}
                {error && (
                  <div className="py-8 px-6">
                    <Body className="text-destructive">{error.message}</Body>
                  </div>
                )}
                {!loading && !error && recentTransactions.length === 0 && (
                  <div className="py-8 text-center">
                    <Body className="text-muted-foreground">
                      Nenhuma transação ainda.
                    </Body>
                  </div>
                )}
                {!loading && !error && recentTransactions.length > 0 && (
                  <ul className="divide-y divide-border">
                    {recentTransactions.map((tx) => (
                      <li key={tx.id} className="flex items-center gap-3 px-4 py-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
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
                            style={{
                              color: tx.category?.color ?? undefined,
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {tx.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateDDMMYY(tx.date)}
                          </p>
                        </div>
                        {tx.category && (
                          <CategoryPill
                            label={tx.category.title}
                            color={tx.category.color ?? '#9ca3af'}
                          />
                        )}
                        <div className="shrink-0 flex items-center gap-1.5">
                          <span className="font-semibold text-black">
                            {tx.type === 'EXPENSE' ? '-' : '+'} R${' '}
                            {formatCurrency(Math.abs(tx.amount))}
                          </span>
                          {tx.type === 'EXPENSE' ? (
                            <Minus className="h-4 w-4 text-red-600" aria-hidden />
                          ) : (
                            <Plus className="h-4 w-4 text-green-600" aria-hidden />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="border-t border-border px-4 py-3 flex justify-center">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary font-medium"
                    onClick={() => setModalOpen(true)}
                  >
                    + Nova transação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories - 1/3 */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="font-light text-gray-500">CATEGORIAS</span>
                  <Link
                    to="/categories"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Gerenciar &gt;
                  </Link>
                </div>
                {categoriesLoading && (
                  <div className="py-8 text-center">
                    <Body className="text-muted-foreground">Carregando...</Body>
                  </div>
                )}
                {categoriesError && (
                  <div className="py-8 px-6">
                    <Body className="text-destructive">{categoriesError.message}</Body>
                  </div>
                )}
                {!categoriesLoading && !categoriesError && categoryStats.length === 0 && (
                  <div className="py-8 text-center">
                    <Body className="text-muted-foreground">
                      Nenhuma categoria com transações ainda.
                    </Body>
                  </div>
                )}
                {!categoriesLoading && !categoriesError && categoryStats.length > 0 && (
                  <ul className="divide-y divide-border">
                    {categoryStats.map((stat) => (
                      <li
                        key={stat.id}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <CategoryPill label={stat.title} color={stat.color} />
                        <span className="text-sm text-muted-foreground">
                          {stat.count} {stat.count === 1 ? 'item' : 'itens'}
                        </span>
                        <span className="font-semibold text-foreground">
                          R$ {formatCurrency(stat.total)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <TransactionFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="create"
        transaction={null}
        onSubmit={handleCreateSubmit}
        loading={mutationLoading}
        categories={categories.map((c) => ({ id: c.id, title: c.title }))}
      />
    </AppLayout>
  )
}
