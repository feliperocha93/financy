import { describe, it, expect } from 'vitest'
import {
  formatDateDDMMYY,
  getMonthYearOptions,
  PERIOD_FILTER_ALL,
} from './date'

describe('formatDateDDMMYY', () => {
  it('formats ISO date string as DD/MM/YY', () => {
    expect(formatDateDDMMYY('2024-03-15')).toBe('15/03/24')
  })

  it('formats ISO datetime string (uses part before T)', () => {
    expect(formatDateDDMMYY('2024-03-15T10:30:00.000Z')).toBe('15/03/24')
  })

  it('returns original string when parts are missing', () => {
    expect(formatDateDDMMYY('invalid')).toBe('invalid')
    expect(formatDateDDMMYY('2024-03')).toBe('2024-03')
  })
})

describe('getMonthYearOptions', () => {
  it('includes "Todo período" as first option', () => {
    const options = getMonthYearOptions()
    expect(options[0]).toEqual({
      value: PERIOD_FILTER_ALL,
      label: 'Todo período',
    })
  })

  it('returns 25 options (1 all + 24 months)', () => {
    const options = getMonthYearOptions()
    expect(options).toHaveLength(25)
  })

  it('each option has value and label', () => {
    const options = getMonthYearOptions()
    options.forEach((opt) => {
      expect(opt).toHaveProperty('value')
      expect(opt).toHaveProperty('label')
      expect(typeof opt.value).toBe('string')
      expect(typeof opt.label).toBe('string')
    })
  })

  it('month-only options have value in YYYY-MM format', () => {
    const options = getMonthYearOptions()
    const monthOptions = options.slice(1)
    const yyyyMm = /^\d{4}-\d{2}$/
    monthOptions.forEach((opt) => {
      expect(opt.value).toMatch(yyyyMm)
    })
  })

  it('labels follow "MonthName / Year" format', () => {
    const options = getMonthYearOptions()
    const monthOptions = options.slice(1)
    monthOptions.forEach((opt) => {
      expect(opt.label).toMatch(/ \/ \d{4}$/)
    })
  })
})
