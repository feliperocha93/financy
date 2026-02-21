import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { H1, Body } from '@/components/design-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo total</CardTitle>
            </CardHeader>
            <CardContent>
              <Body className="text-2xl font-semibold">R$ 12.847,32</Body>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receitas do mês</CardTitle>
            </CardHeader>
            <CardContent>
              <Body className="text-2xl font-semibold text-green-600">R$ 4.250,00</Body>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas do mês</CardTitle>
            </CardHeader>
            <CardContent>
              <Body className="text-2xl font-semibold text-red-600">R$ 2.180,45</Body>
            </CardContent>
          </Card>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <H1 className="!mt-0">Transações recentes</H1>
            <Link to="/transactions" className="text-sm font-medium text-primary hover:underline">
              Ver todas
            </Link>
          </div>
          <Card>
            <CardContent className="py-8">
              <Body className="text-muted-foreground text-center">
                Navegue até Transações para ver seu histórico.
              </Body>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
