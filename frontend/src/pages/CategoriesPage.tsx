import { useQuery } from '@apollo/client/react'
import { AppLayout } from '@/components/AppLayout'
import { H1, Body } from '@/components/design-system'
import { Card, CardContent } from '@/components/ui/card'
import { CATEGORIES } from '@/graphql/operations'

type Category = { id: string; title: string; icon: string; color: string }

export function CategoriesPage() {
  const { data, loading, error } = useQuery<{ categories: Category[] }>(CATEGORIES)

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <H1>Categorias</H1>
          <Body className="text-muted-foreground mt-1">Gerenciar suas categorias</Body>
        </div>

        {loading && <Body>Carregando...</Body>}
        {error && <p className="text-destructive">{error.message}</p>}

        {data?.categories && data.categories.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <Body className="text-muted-foreground text-center">Nenhuma categoria ainda.</Body>
            </CardContent>
          </Card>
        )}

        {data?.categories && data.categories.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.categories.map((cat: Category) => (
              <Card key={cat.id}>
                <CardContent className="pt-6">
                  <div
                    className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-lg"
                    style={{ backgroundColor: cat.color || '#e5e7eb' }}
                  >
                    {cat.icon || '📁'}
                  </div>
                  <Body className="font-medium">{cat.title}</Body>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
