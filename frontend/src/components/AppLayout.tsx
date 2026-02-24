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

function getInitials(name: string | undefined, email: string | undefined): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2)
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email?.trim()) {
    return email.slice(0, 2).toUpperCase()
  }
  return '?'
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  const initials = getInitials(user?.name, user?.email)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <PageContainer className="flex h-14 items-center justify-between">
          <nav className="flex items-center gap-6">
            <Link to="/" className="flex items-center shrink-0" aria-label="Financy home">
              <img src={logoSrc} alt="Financy" className="h-8" />
            </Link>
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
          <Link
            to="/profile"
            className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Abrir perfil"
          >
            <Avatar name={user?.name ?? ''} email={user?.email ?? ''} size="sm" />
          </Link>
        </PageContainer>
      </header>
      <main className="flex-1 py-8">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  )
}
