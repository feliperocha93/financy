import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/design-system'
import { LogOut } from 'lucide-react'

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transações' },
  { to: '/categories', label: 'Categorias' },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <PageContainer className="flex h-14 items-center justify-between">
          <nav className="flex items-center gap-6">
            {nav.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === to ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Sair da conta">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </PageContainer>
      </header>
      <main className="flex-1 py-8">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  )
}
