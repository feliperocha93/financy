import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardHeader, CardContent } from '@/components/ui/card'
import { SelectField } from '@/components/ui/select'
import { CATEGORY_ICON_OPTIONS } from '@/lib/categoryIcons'
import { CATEGORY_COLOR_OPTIONS } from '@/constants/categoryColors'
import type { Category } from '@/types/category'

const schema = z.object({
  title: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
})

type FormData = z.infer<typeof schema>

export interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  category?: Category | null
  onSubmit: (data: FormData) => Promise<void>
  loading?: boolean
}

const iconSelectOptions = CATEGORY_ICON_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}))
const colorSelectOptions = CATEGORY_COLOR_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}))

export function CategoryFormModal({
  open,
  onOpenChange,
  mode,
  category,
  onSubmit,
  loading = false,
}: CategoryFormModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      icon: 'Folder',
      color: CATEGORY_COLOR_OPTIONS[0].value,
    },
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && category) {
      form.reset({
        title: category.title,
        description: category.description ?? '',
        icon: category.icon || 'Folder',
        color: category.color || CATEGORY_COLOR_OPTIONS[0].value,
      })
    } else if (mode === 'create') {
      form.reset({
        title: '',
        description: '',
        icon: 'Folder',
        color: CATEGORY_COLOR_OPTIONS[0].value,
      })
    }
  }, [open, mode, category?.id, form])

  async function handleSubmit(values: FormData) {
    await onSubmit(values)
    onOpenChange(false)
  }

  const title = mode === 'create' ? 'Nova categoria' : 'Editar categoria'

  return (
    <Modal open={open} onOpenChange={onOpenChange} contentClassName="p-0">
      <CardHeader className="space-y-1 pb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {mode === 'create'
            ? 'Preencha os dados para criar uma nova categoria.'
            : 'Altere os dados da categoria.'}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            label="Nome"
            placeholder="Ex: Alimentação"
            error={!!form.formState.errors.title}
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
          <Input
            label="Descrição (opcional)"
            placeholder="Ex: Restaurantes, delivery e refeições"
            {...form.register('description')}
          />
          <SelectField
            label="Ícone"
            options={iconSelectOptions}
            value={form.watch('icon')}
            onValueChange={(v) => form.setValue('icon', v)}
            error={!!form.formState.errors.icon}
          />
          {form.formState.errors.icon && (
            <p className="text-sm text-destructive">
              {form.formState.errors.icon.message}
            </p>
          )}
          <SelectField
            label="Cor"
            options={colorSelectOptions}
            value={form.watch('color')}
            onValueChange={(v) => form.setValue('color', v)}
            error={!!form.formState.errors.color}
          />
          {form.formState.errors.color && (
            <p className="text-sm text-destructive">
              {form.formState.errors.color.message}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Modal>
  )
}
