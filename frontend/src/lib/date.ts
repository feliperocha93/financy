/**
 * Format ISO or YYYY-MM-DD date string as DD/MM/YY (pt-BR).
 */
export function formatDateDDMMYY(isoDate: string): string {
  const part = isoDate.split('T')[0] ?? isoDate
  const [y, m, d] = part.split('-')
  if (!d || !m || !y) return isoDate
  return `${d}/${m}/${y.slice(-2)}`
}

export interface MonthYearOption {
  value: string
  label: string
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

/** Sentinel value for "no filter" in period select. Radix Select does not allow empty string as item value. */
export const PERIOD_FILTER_ALL = 'all'

/**
 * Build period filter options: "Todo período" plus last 24 months (e.g. "Novembro / 2024").
 */
export function getMonthYearOptions(): MonthYearOption[] {
  const options: MonthYearOption[] = [
    { value: PERIOD_FILTER_ALL, label: 'Todo período' },
  ]
  const now = new Date()
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = `${MONTH_NAMES[d.getMonth()]} / ${d.getFullYear()}`
    options.push({ value, label })
  }
  return options
}

export const PERIOD_OPTIONS = getMonthYearOptions()
