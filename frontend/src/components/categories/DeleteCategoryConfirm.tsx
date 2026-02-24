import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { CardHeader, CardContent } from '@/components/ui/card'
import type { Category } from '@/types/category'

export interface DeleteCategoryConfirmProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onConfirm: (category: Category) => Promise<void>
  loading?: boolean
  errorMessage?: string | null
}

export function DeleteCategoryConfirm({
  open,
  onOpenChange,
  category,
  onConfirm,
  loading = false,
  errorMessage,
}: DeleteCategoryConfirmProps) {
  if (!category) return null

  async function handleConfirm() {
    if (!category) return
    await onConfirm(category)
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} contentClassName="p-0">
      <CardHeader className="space-y-1 pb-2">
        <h2 className="text-xl font-semibold">Excluir categoria</h2>
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja excluir &quot;{category.title}&quot;? Esta ação
          não pode ser desfeita.
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {errorMessage && (
          <p className="mb-4 text-sm text-destructive">{errorMessage}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </CardContent>
    </Modal>
  )
}
