import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LOGIN } from '@/graphql/operations'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Body } from '@/components/design-system'
import { PageContainer } from '@/components/design-system'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
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

  function onSubmit(values: FormData) {
    loginMutation({ variables: { email: values.email, password: values.password } })
  }

  return (
    <PageContainer maxWidth="sm" className="min-h-screen flex flex-col items-center justify-center py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Sign in to your Financy account</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-destructive">{error.message}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            <Body className="text-center text-muted-foreground">
              Don't have an account? <Link to="/signup" className="text-primary underline">Sign up</Link>
            </Body>
          </CardFooter>
        </form>
      </Card>
    </PageContainer>
  )
}
