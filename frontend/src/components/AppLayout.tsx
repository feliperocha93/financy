import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { PageContainer } from '@/components/design-system'
import { Avatar } from '@/components/Avatar'

import logoSrc from '@/assets/Logo.svg'

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transações' },
  { to: '/categories', label: 'Categorias' },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-background">
        <PageContainer className="relative flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center shrink-0" aria-label="Financy home">
            <img src={logoSrc} alt="Financy" className="h-8" />
          </Link>

          <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {nav.map(({ to, label }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <Link
            to="/profile"
            className="flex shrink-0 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Abrir perfil"
          >
            <Avatar
              name={user?.name ?? ''}
              email={user?.email ?? ''}
              size="sm"
              className="bg-gray-200 text-gray-600"
            />
          </Link>
        </PageContainer>
      </header>
      <main className="flex-1 py-8 bg-[var(--page-background)]">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  )
}
