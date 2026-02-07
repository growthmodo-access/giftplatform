/**
 * Site configuration for SEO, metadata, and shared constants.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://goodies.so).
 */

export const siteConfig = {
  name: 'Goodies',
  shortName: 'Goodies.so',
  tagline: 'Corporate gifting, without the chaos',
  description:
    'Send gifts to employees, clients, and partners—globally, in minutes. One platform for gifting, swag, addresses, approvals, branding, and worldwide delivery. No spreadsheets. No vendors to chase.',
  descriptionShort: 'One platform to send corporate gifts globally—without spreadsheets, vendors, or chaos. Built in India. Ships to 100+ locations.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://goodies.so',
  locale: 'en_IN',
  twitterHandle: '@goodies_so',
  links: {
    contact: '/contact',
    login: '/login',
    signup: '/signup',
    privacy: '/privacy',
    terms: '/terms',
  },
  organization: {
    name: 'Goodies',
    url: 'https://goodies.so',
    logo: 'https://goodies.so/logogoodies.png',
    email: 'hello@goodies.so',
  },
} as const

export type SiteConfig = typeof siteConfig
