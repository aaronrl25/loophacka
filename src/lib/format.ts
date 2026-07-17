import type { Unit } from '../types'

const compactCurrency = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
  style: 'currency',
  currency: 'USD',
})

const fullCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number, compact = true): string {
  return compact ? compactCurrency.format(value) : fullCurrency.format(value)
}

export function formatValue(value: number, unit: Unit): string {
  switch (unit) {
    case 'currency':
      return formatCurrency(value)
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'months':
      return `${value.toFixed(1)} mo`
    case 'days':
      return `${Math.round(value)} days`
    case 'number':
      return value.toLocaleString('en-US')
  }
}

export function formatDelta(delta: number): string {
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}%`
}

/** Direction of a delta given whether higher is the good outcome. */
export function deltaTone(
  delta: number,
  higherIsBetter: boolean,
): 'good' | 'bad' | 'flat' {
  if (Math.abs(delta) < 0.05) return 'flat'
  const isUp = delta > 0
  return isUp === higherIsBetter ? 'good' : 'bad'
}

export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime()
  const diffMin = Math.round((now.getTime() - then) / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.round(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.round(diffH / 24)
  return `${diffD}d ago`
}
