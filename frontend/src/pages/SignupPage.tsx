import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Lock, Eye, EyeClosed as EyeOff, LogIn } from 'lucide-react'
import { SIGNUP } from '@/graphql/operations'
import { useAuth } from '@/contexts/AuthContext'
import { setRememberedCredentials } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardContent } from '@/components/ui/card'
import { AccessCard } from '@/components/AccessCard'
import { getAuthErrorMessage } from '@/lib/auth-errors'

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

type FormData = z.infer<typeof schema>

export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [signupMutation, { loading, error }] = useMutation(SIGNUP, {
    onCompleted: (data: unknown, clientOptions) => {
      const payload = data as { signup: { token: string; user: { id: string; name: string; email: string } } }
      const { token, user } = payload.signup
      login(token, user)
      const variables = clientOptions?.variables as { email?: string; password?: string } | undefined
      const email = variables?.email
      const password = variables?.password
      if (email && password) {
        setRememberedCredentials(email, password)
      }
      navigate('/', { replace: true })
    },
  })

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const errorMessage = getAuthErrorMessage(error ?? undefined)

  function onSubmit(values: FormData) {
    signupMutation({ variables: { name: values.name, email: values.email, password: values.password } })
  }

  return (
    <AccessCard
      title="Criar conta"
      subtitle="Comece a controlar suas finanças ainda hoje"
      secondaryLabel="Fazer login"
      secondaryTo="/login"
      secondaryDescription="Já tem uma conta?"
      secondaryIcon={<LogIn />}
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
          <div className="space-y-2">
            <Input
              id="name"
              label="Nome completo"
              type="text"
              placeholder="Seu nome completo"
              startIcon={<User />}
              error={!!form.formState.errors.name}
              valid={!form.formState.errors.name && !!form.watch('name')}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="email"
              label="E-mail"
              type="email"
              placeholder="mail@exemplo.com"
              startIcon={<Mail />}
              error={!!form.formState.errors.email}
              valid={!form.formState.errors.email && !!form.watch('email')}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              startIcon={<Lock />}
              error={!!form.formState.errors.password}
              valid={!form.formState.errors.password && (form.watch('password')?.length ?? 0) >= 8}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="cursor-pointer hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              }
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              A senha deve ter no mínimo 8 caracteres
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </CardContent>
      </form>
    </AccessCard>
  )
}
