const TOKEN_KEY = 'financy_token'
const USER_KEY = 'financy_user'
const CREDENTIALS_KEY = 'financy_remember_credentials'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function setUser(user: { id: string; name: string; email: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser(): { id: string; name: string; email: string } | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as { id: string; name: string; email: string }
  } catch {
    return null
  }
}

export function getRememberedCredentials(): { email: string; password: string } | null {
  const raw = localStorage.getItem(CREDENTIALS_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { email?: string; password?: string }
    if (typeof parsed?.email === 'string' && typeof parsed?.password === 'string') {
      return { email: parsed.email, password: parsed.password }
    }
    return null
  } catch {
    return null
  }
}

export function setRememberedCredentials(email: string, password: string): void {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ email, password }))
}

export function clearRememberedCredentials(): void {
  localStorage.removeItem(CREDENTIALS_KEY)
}
