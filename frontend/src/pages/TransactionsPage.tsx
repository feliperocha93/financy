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
          <H1>Transactions</H1>
          <Body className="text-muted-foreground mt-1">List of all your transactions</Body>
        </div>

        {loading && <Body>Loading...</Body>}
        {error && <p className="text-destructive">{error.message}</p>}

        {data?.transactions && data.transactions.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <Body className="text-muted-foreground text-center">No transactions yet.</Body>
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
                    {tx.date} · {tx.category?.title ?? 'Uncategorized'} · {tx.type}
                  </Body>
                </CardHeader>
                <CardContent>
                  <Body className="font-medium">{tx.amount.toLocaleString()}</Body>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
