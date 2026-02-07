/**
 * Currency formatting — India-first (INR default), with USD support.
 * Use for display across dashboard, orders, billing, and products.
 */

export type SupportedCurrency = 'INR' | 'USD'

const DEFAULT_CURRENCY: SupportedCurrency = 'INR'

const SYMBOLS: Record<SupportedCurrency, string> = {
  INR: '₹',
  USD: '$',
}

/**
 * Format amount for display (e.g. ₹1,234.56 or $1,234.56)
 */
export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = DEFAULT_CURRENCY,
  options?: { compact?: boolean; decimals?: number }
): string {
  const symbol = SYMBOLS[currency]
  const locale = currency === 'INR' ? 'en-IN' : 'en-US'
  if (options?.compact && (amount >= 1000 || amount <= -1000)) {
    const value = amount >= 0 ? amount : -amount
    const k = value / 1000
    const formatted = k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`
    return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`
  }
  const decimals = options?.decimals ?? 2
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
  return `${symbol}${formatted}`
}

/**
 * Short format for dashboards (e.g. ₹10k, $1.5k)
 */
export function formatCurrencyShort(
  amount: number,
  currency: SupportedCurrency = DEFAULT_CURRENCY
): string {
  return formatCurrency(amount, currency, { compact: true })
}

/**
 * Resolve currency from company/order or fallback to platform default (INR)
 */
export function resolveCurrency(currency?: string | null): SupportedCurrency {
  if (currency === 'INR' || currency === 'USD') return currency
  return DEFAULT_CURRENCY
}
