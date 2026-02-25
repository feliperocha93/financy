/**
 * Format number as Brazilian Real currency (e.g. "1.234,56").
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Parse pt-BR currency string to number (e.g. "1.234,56" -> 1234.56).
 * Accepts "R$ 1.234,56", "1234,56", "1234.56", etc.
 */
export function parseCurrency(input: string): number {
  const normalized = input
    .replace(/\s/g, '')
    .replace(/R\$/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  const parsed = parseFloat(normalized)
  return Number.isNaN(parsed) ? 0 : parsed
}
