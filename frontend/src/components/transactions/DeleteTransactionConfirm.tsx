import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { CardHeader, CardContent } from '@/components/ui/card'
import type { Transaction } from '@/types/transaction'

export interface DeleteTransactionConfirmProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
  onConfirm: (transaction: Transaction) => Promise<void>
  loading?: boolean
}

export function DeleteTransactionConfirm({
  open,
  onOpenChange,
  transaction,
  onConfirm,
  loading = false,
}: DeleteTransactionConfirmProps) {
  if (!transaction) return null

  async function handleConfirm() {
    if (!transaction) return
    await onConfirm(transaction)
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} contentClassName="p-0">
      <div className="p-6">
        <CardHeader className="space-y-1 pb-2 px-0">
          <h2 className="text-xl font-semibold">Excluir transação</h2>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir &quot;{transaction.description}&quot;?
            Esta ação não pode ser desfeita.
          </p>
        </CardHeader>
        <CardContent className="pt-0 px-0">
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
      </div>
    </Modal>
  )
}
