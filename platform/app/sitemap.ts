import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, '')

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ]

  let companyStores: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data: rows } = await supabase
      .from('companies')
      .select('store_identifier, updated_at')
      .not('store_identifier', 'is', null)
    if (rows?.length) {
      companyStores = rows.map((row) => ({
        url: `${baseUrl}/companies/${encodeURIComponent(row.store_identifier)}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // If RLS or DB blocks anon read, only static entries are returned
  }

  return [...staticEntries, ...companyStores]
}
