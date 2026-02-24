import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, LogOut, Divide } from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { UPDATE_PROFILE } from '@/graphql/operations'

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
})

type FormData = z.infer<typeof schema>

export function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '' },
  })

  const [updateProfileMutation, { loading, error }] = useMutation(UPDATE_PROFILE, {
    onCompleted: (data: { updateProfile: { id: string; name: string; email: string } }) => {
      updateUser({ name: data.updateProfile.name })
      form.reset({ name: data.updateProfile.name })
    },
  })

  if (!user) return null

  function onSubmit(values: FormData) {
    updateProfileMutation({ variables: { name: values.name } })
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <AppLayout>
      <div className="flex justify-center">
        <Card className="w-full max-w-[448px]">
          <CardHeader className="flex flex-col items-center text-center pb-2">
            <Avatar name={user.name} email={user.email} size="lg" className="mb-3" />
            <h2 className="text-xl font-semibold leading-none tracking-tight">{user.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </CardHeader>
          <hr className="m-6" />
          <CardContent className="space-y-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nome completo"
                startIcon={<User className="size-4" />}
                {...form.register('name')}
                error={!!form.formState.errors.name}
                helperText={form.formState.errors.name?.message}
              />
              <Input
                label="E-mail"
                startIcon={<Mail className="size-4" />}
                value={user.email}
                disabled
                helperText="O e-mail não pode ser alterado"
              />
              {error && (
                <p className="text-sm text-destructive">
                  Não foi possível salvar. Tente novamente.
                </p>
              )}
              <div className="flex flex-col gap-3 pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Salvando…' : 'Salvar alterações'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Sair da conta
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
