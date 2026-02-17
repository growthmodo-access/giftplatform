import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/$/, '')
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/api/',
          '/login',
          '/signup',
          '/check-role',
          '/g/', // one-time gift links — do not index
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
