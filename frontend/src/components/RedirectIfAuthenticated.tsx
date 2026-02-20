import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
