/**
 * Returns a user-facing message for auth mutations (login/signup).
 * Handles backend-known errors so the UI reacts properly for every situation.
 */
export function getAuthErrorMessage(
  error: (Error & { graphQLErrors?: Array<{ message: string }> }) | undefined
): string | null {
  if (!error) return null
  const message =
    error.graphQLErrors?.[0]?.message ??
    error.message ??
    'Ocorreu um erro. Tente novamente.'
  if (message === 'User already exists') return 'Este e-mail já está cadastrado.'
  if (message === 'Invalid credentials') return 'E-mail ou senha inválidos.'
  return message
}
