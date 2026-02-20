import { AppLayout } from '@/components/AppLayout'
import { H1, Body } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <H1>Dashboard</H1>
          <Body className="text-muted-foreground mt-1">Overview of your finances</Body>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Your transactions and categories are available from the navigation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Body>Use the menu above to manage transactions and categories.</Body>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
