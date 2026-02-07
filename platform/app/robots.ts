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
          '/companies/',
          '/login',
          '/signup',
          '/check-role',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
