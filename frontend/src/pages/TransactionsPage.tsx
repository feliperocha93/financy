import { useQuery } from '@apollo/client/react'
import { AppLayout } from '@/components/AppLayout'
import { H1, Body } from '@/components/design-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TRANSACTIONS } from '@/graphql/operations'

type Transaction = { id: string; description: string; amount: number; date: string; type: string; category?: { title: string } }

export function TransactionsPage() {
  const { data, loading, error } = useQuery<{ transactions: Transaction[] }>(TRANSACTIONS)

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <H1>Transações</H1>
          <Body className="text-muted-foreground mt-1">Lista de todas as suas transações</Body>
        </div>

        {loading && <Body>Carregando...</Body>}
        {error && <p className="text-destructive">{error.message}</p>}

        {data?.transactions && data.transactions.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <Body className="text-muted-foreground text-center">Nenhuma transação ainda.</Body>
            </CardContent>
          </Card>
        )}

        {data?.transactions && data.transactions.length > 0 && (
          <div className="space-y-4">
            {data.transactions.map((tx: Transaction) => (
              <Card key={tx.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{tx.description}</CardTitle>
                  <Body className="text-sm text-muted-foreground">
                    {tx.date} · {tx.category?.title ?? 'Sem categoria'} · {tx.type}
                  </Body>
                </CardHeader>
                <CardContent>
                  <Body className={`font-medium ${tx.type === 'income' || tx.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount >= 0 ? '+' : ''} R$ {Math.abs(tx.amount).toLocaleString('pt-BR')}
                  </Body>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
