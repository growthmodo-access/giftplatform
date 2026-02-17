import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'About us',
  description: `Learn about ${siteConfig.name}—corporate gifting built for modern teams. We help companies send gifts globally with one platform. Built in India, shipping to 100+ locations.`,
  path: 'about',
  keywords: ['about Goodies', 'corporate gifting platform', 'employee gifting', 'global gifting', 'India'],
})

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
