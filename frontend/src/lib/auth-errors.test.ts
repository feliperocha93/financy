import { describe, it, expect } from 'vitest'
import { getAuthErrorMessage } from './auth-errors'

describe('getAuthErrorMessage', () => {
  it('returns null when error is undefined', () => {
    expect(getAuthErrorMessage(undefined)).toBe(null)
  })

  it('returns null when error is null', () => {
    expect(getAuthErrorMessage(null as unknown as undefined)).toBe(null)
  })

  it('returns user-facing message for "User already exists"', () => {
    const error = new Error('User already exists') as Error & {
      graphQLErrors?: Array<{ message: string }>
    }
    expect(getAuthErrorMessage(error)).toBe('Este e-mail já está cadastrado.')
  })

  it('returns user-facing message for "Invalid credentials"', () => {
    const error = new Error('Invalid credentials') as Error & {
      graphQLErrors?: Array<{ message: string }>
    }
    expect(getAuthErrorMessage(error)).toBe('E-mail ou senha inválidos.')
  })

  it('prefers graphQLErrors[0].message when present', () => {
    const error = {
      message: 'Generic',
      graphQLErrors: [{ message: 'User already exists' }],
    } as Error & { graphQLErrors?: Array<{ message: string }> }
    expect(getAuthErrorMessage(error)).toBe('Este e-mail já está cadastrado.')
  })

  it('falls back to error.message when no graphQLErrors', () => {
    const error = new Error('Custom error message')
    expect(getAuthErrorMessage(error)).toBe('Custom error message')
  })

  it('falls back to generic message when error has no message', () => {
    const error = {} as Error
    expect(getAuthErrorMessage(error)).toBe(
      'Ocorreu um erro. Tente novamente.'
    )
  })

  it('returns message as-is for unknown backend messages', () => {
    const error = new Error('Some other error')
    expect(getAuthErrorMessage(error)).toBe('Some other error')
  })
})
