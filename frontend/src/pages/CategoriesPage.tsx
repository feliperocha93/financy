import { useState } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { H1, Body } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCategories } from '@/hooks/useCategories'
import { useCategoryMutations } from '@/hooks/useCategoryMutations'
import {
  CategorySummaryCards,
  CategoryCard,
  CategoryFormModal,
  DeleteCategoryConfirm,
} from '@/components/categories'
import type { Category } from '@/types/category'

export function CategoriesPage() {
  const { categories, loading, error, refetch } = useCategories()
  const {
    createCategory,
    updateCategory,
    deleteCategory,
    loading: mutationLoading,
    error: mutationError,
    errorCode: mutationErrorCode,
  } = useCategoryMutations(refetch)

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const handleOpenCreate = () => {
    setFormMode('create')
    setEditingCategory(null)
    setFormOpen(true)
  }

  const handleEdit = (category: Category) => {
    setFormMode('edit')
    setEditingCategory(category)
    setFormOpen(true)
  }

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (data: {
    title: string
    description?: string
    icon: string
    color: string
  }) => {
    if (formMode === 'create') {
      await createCategory({
        title: data.title,
        description: data.description || undefined,
        icon: data.icon,
        color: data.color,
      })
    } else if (editingCategory) {
      await updateCategory(editingCategory.id, {
        title: data.title,
        description: data.description || undefined,
        icon: data.icon,
        color: data.color,
      })
    }
    setFormOpen(false)
  }

  const handleDeleteConfirm = async (category: Category) => {
    await deleteCategory(category.id)
    setDeleteOpen(false)
    setDeletingCategory(null)
  }

  const deleteErrorMessage =
    mutationErrorCode === 'CATEGORY_HAS_TRANSACTIONS'
      ? mutationError?.message ?? null
      : null

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <H1>Categorias</H1>
            <Body className="mt-1 text-muted-foreground">
              Organize suas transações por categorias
            </Body>
          </div>
          <Button
            className="shrink-0 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-brand-dark"
            onClick={handleOpenCreate}
          >
            + Nova categoria
          </Button>
        </div>

        {loading && <Body>Carregando...</Body>}
        {error && <p className="text-destructive">{error.message}</p>}

        {!loading && !error && (
          <>
            <CategorySummaryCards categories={categories} />

            {categories.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <Body className="text-center text-muted-foreground">
                    Nenhuma categoria ainda.
                  </Body>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CategoryFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        category={formMode === 'edit' ? editingCategory : null}
        onSubmit={handleFormSubmit}
        loading={mutationLoading}
      />

      <DeleteCategoryConfirm
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) setDeletingCategory(null)
        }}
        category={deletingCategory}
        onConfirm={handleDeleteConfirm}
        loading={mutationLoading}
        errorMessage={deleteErrorMessage}
      />
    </AppLayout>
  )
}
