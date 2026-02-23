import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/utils'
import { CATEGORY_ICON_OPTIONS, getCategoryIcon } from '@/lib/categoryIcons'
import { CATEGORY_COLOR_OPTIONS } from '@/constants/categoryColors'
import type { Category } from '@/types/category'

const schema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
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
      icon: CATEGORY_ICON_OPTIONS[0].value,
      color: CATEGORY_COLOR_OPTIONS[0].value,
    },
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && category) {
      form.reset({
        title: category.title,
        description: category.description ?? '',
        icon: category.icon || CATEGORY_ICON_OPTIONS[0].value,
        color: category.color || CATEGORY_COLOR_OPTIONS[0].value,
      })
    } else if (mode === 'create') {
      form.reset({
        title: '',
        description: '',
        icon: CATEGORY_ICON_OPTIONS[0].value,
        color: CATEGORY_COLOR_OPTIONS[0].value,
      })
    }
  }, [open, mode, category?.id, form])

  async function handleSubmit(values: FormData) {
    await onSubmit(values)
    onOpenChange(false)
  }

  const modalTitle = mode === 'create' ? 'Nova categoria' : 'Editar categoria'
  const subtitle =
    mode === 'create'
      ? 'Organize suas transações com categorias.'
      : 'Altere os dados da categoria.'
  const selectedIcon = form.watch('icon')
  const selectedColor = form.watch('color')

  return (
    <Modal open={open} onOpenChange={onOpenChange} contentClassName="p-0">
      <div className="p-6">
        {/* Header: title + subtitle + close X */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h2 className="text-xl font-semibold">{modalTitle}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <IconButton
            size="sm"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar"
            className="shrink-0 rounded-md"
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <Input
            label="Título"
            placeholder="Ex. Alimentação"
            error={!!form.formState.errors.title}
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive -mt-2">
              {form.formState.errors.title.message}
            </p>
          )}

          <Textarea
            label="Descrição"
            placeholder="Descrição da categoria"
            helperText="Opcional"
            error={!!form.formState.errors.description}
            {...form.register('description')}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive -mt-2">
              {form.formState.errors.description.message}
            </p>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-muted-foreground">
              Ícone
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {CATEGORY_ICON_OPTIONS.map((option) => {
                const Icon = getCategoryIcon(option.value)
                const isSelected = selectedIcon === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => form.setValue('icon', option.value)}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-md border transition-colors',
                      isSelected
                        ? 'border-primary bg-green-100 text-primary ring-2 ring-primary'
                        : 'border-input bg-background text-gray-500 hover:border-gray-400 hover:text-foreground'
                    )}
                    aria-pressed={isSelected}
                    aria-label={option.label}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </button>
                )
              })}
            </div>
            {form.formState.errors.icon && (
              <p className="text-sm text-destructive">
                {form.formState.errors.icon.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-muted-foreground">
              Cor
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLOR_OPTIONS.map((option) => {
                const isSelected = selectedColor === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => form.setValue('color', option.value)}
                    className={cn(
                      'h-9 w-9 rounded-full border-2 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isSelected
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    style={{ backgroundColor: option.value }}
                    aria-pressed={isSelected}
                    aria-label={option.label}
                  />
                )
              })}
            </div>
            {form.formState.errors.color && (
              <p className="text-sm text-destructive">
                {form.formState.errors.color.message}
              </p>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="min-w-[140px] rounded-lg"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
