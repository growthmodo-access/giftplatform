/**
 * Site configuration for SEO, metadata, and shared constants.
 * Canonical domain is goodies.so. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://goodies.so).
 */

function normalizeToGoodiesSo(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'goodies.co') {
      parsed.hostname = 'goodies.so'
      return parsed.toString().replace(/\/$/, '')
    }
    return url.replace(/\/$/, '')
  } catch {
    return url.replace(/\/$/, '')
  }
}

export const siteConfig = {
  name: 'Goodies',
  shortName: 'Goodies',
  companyLegalName: 'Acots Global Private Limited',
  tagline: 'Corporate gifting, without the chaos',
  description:
    'Send gifts to employees, clients, and partners—globally, in minutes. One platform for gifting, swag, addresses, approvals, branding, and worldwide delivery. No spreadsheets. No vendors to chase.',
  descriptionShort: 'One platform to send corporate gifts globally—without spreadsheets, vendors, or chaos. Built in India. Ships to 100+ locations.',
  get url() {
    return normalizeToGoodiesSo(process.env.NEXT_PUBLIC_SITE_URL || 'https://goodies.so')
  },
  locale: 'en_IN',
  twitterHandle: '@goodies_so',
  supportEmail: 'hello@goodies.so',
  supportPhone: '+91 9992628666',
  links: {
    contact: '/contact',
    about: '/about',
    login: '/login',
    signup: '/signup',
    privacy: '/privacy',
    terms: '/terms',
    instagram: 'https://instagram.com/goodies.so',
    facebook: 'https://facebook.com/goodies.so',
  },
  organization: {
    name: 'Goodies',
    legalName: 'Acots Global Private Limited',
    url: 'https://goodies.so',
    logo: 'https://goodies.so/logogoodies.png',
    email: 'hello@goodies.so',
  },
} as const

/** Base URL for app/store links. Canonical domain is goodies.so (goodies.co is normalized to goodies.so). */
export function getAppBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_STORE_URL || 'https://goodies.so'
  return normalizeToGoodiesSo(raw)
}

/** Base URL for store links (path-based store URL). */
export function getStoreBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_STORE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://goodies.so'
  return normalizeToGoodiesSo(raw)
}

export type SiteConfig = typeof siteConfig
