import * as React from 'react'
import { getToken, clearToken, setToken as persistToken, setUser, getUser } from '@/lib/auth'

type User = { id: string; name: string; email: string }

type AuthContextValue = {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (updates: Pick<User, 'name'>) => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = React.useState<string | null>(() => getToken())
  const [user, setUserState] = React.useState<User | null>(() => getUser())

  const login = React.useCallback((newToken: string, newUser: User) => {
    persistToken(newToken)
    setUser(newUser)
    setTokenState(newToken)
    setUserState(newUser)
  }, [])

  const logout = React.useCallback(() => {
    clearToken()
    setTokenState(null)
    setUserState(null)
  }, [])

  const updateUser = React.useCallback((updates: Pick<User, 'name'>) => {
    setUserState((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      setUser(next)
      return next
    })
  }, [])

  const value: AuthContextValue = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
