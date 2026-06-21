import type { ColumnWidth } from './components/types'

export const DEFAULT_COLUMN_WIDTH = '33.333%'

function formatPercentage(value: number): string {
  return `${value.toFixed(3).replace(/\.?0+$/, '')}%`
}

function supportsWidth(value: string): boolean {
  if (typeof window === 'undefined') return true
  if (typeof globalThis.CSS?.supports !== 'function') return true
  return globalThis.CSS.supports('width', value)
}

export function resolveColumnWidth(width: ColumnWidth | undefined): string {
  if (typeof width === 'number') {
    if (Number.isFinite(width) && width > 0 && width <= 1) {
      return formatPercentage(width * 100)
    }
    return DEFAULT_COLUMN_WIDTH
  }

  if (typeof width === 'string') {
    const value = width.trim()
    if (value === '') return DEFAULT_COLUMN_WIDTH

    const fractionMatch = value.match(/^(\d+)\/(\d+)$/)
    if (fractionMatch != null) {
      const numerator = Number(fractionMatch[1])
      const denominator = Number(fractionMatch[2])
      if (denominator === 0 || numerator > denominator) {
        return DEFAULT_COLUMN_WIDTH
      }
      return formatPercentage((numerator / denominator) * 100)
    }

    return supportsWidth(value) ? value : DEFAULT_COLUMN_WIDTH
  }

  return DEFAULT_COLUMN_WIDTH
}
