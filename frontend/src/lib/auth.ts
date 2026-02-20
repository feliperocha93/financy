const TOKEN_KEY = 'financy_token'
const USER_KEY = 'financy_user'

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
