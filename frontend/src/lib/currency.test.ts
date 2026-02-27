import { describe, it, expect } from 'vitest'
import { formatCurrency, parseCurrency } from './currency'

describe('formatCurrency', () => {
  it('formats number as pt-BR currency (e.g. 1234.56 -> "1.234,56")', () => {
    expect(formatCurrency(1234.56)).toBe('1.234,56')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('0,00')
  })

  it('formats negative numbers', () => {
    expect(formatCurrency(-100.5)).toBe('-100,50')
  })

  it('formats large numbers with thousands separator', () => {
    expect(formatCurrency(1_000_000.99)).toBe('1.000.000,99')
  })
})

describe('parseCurrency', () => {
  it('parses "R$ 1.234,56" to 1234.56', () => {
    expect(parseCurrency('R$ 1.234,56')).toBe(1234.56)
  })

  it('parses "1234,56" to 1234.56', () => {
    expect(parseCurrency('1234,56')).toBe(1234.56)
  })

  it('parses "1234.56" by stripping dots (result 123456)', () => {
    expect(parseCurrency('1234.56')).toBe(123456)
  })

  it('returns 0 for empty string', () => {
    expect(parseCurrency('')).toBe(0)
  })

  it('returns 0 for invalid input', () => {
    expect(parseCurrency('abc')).toBe(0)
    expect(parseCurrency('--')).toBe(0)
  })

  it('strips spaces and R$ before parsing', () => {
    expect(parseCurrency('  R$  1.234,56  ')).toBe(1234.56)
  })
})
