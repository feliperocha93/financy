import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { LOGIN } from '@/graphql/operations'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent } from '@/components/ui/card'
import { AccessCard } from '@/components/AccessCard'
import { getAuthErrorMessage } from '@/lib/auth-errors'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type FormData = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loginMutation, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data: unknown) => {
      const payload = data as { login: { token: string; user: { id: string; name: string; email: string } } }
      const { token, user } = payload.login
      login(token, user)
      navigate('/', { replace: true })
    },
  })

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const errorMessage = getAuthErrorMessage(error ?? undefined)

  function onSubmit(values: FormData) {
    loginMutation({ variables: { email: values.email, password: values.password } })
  }

  return (
    <AccessCard
      title="Fazer login"
      subtitle="Entre na sua conta para continuar"
      secondaryLabel="Criar conta"
      secondaryTo="/signup"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@exemplo.com"
              startIcon={<Mail />}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              startIcon={<Lock />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="cursor-pointer hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              }
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-input" />
              <span className="text-muted-foreground">Lembrar-me</span>
            </label>
            <Link to="#" className="text-primary underline hover:no-underline">
              Recuperar senha
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </CardContent>
      </form>
    </AccessCard>
  )
}
