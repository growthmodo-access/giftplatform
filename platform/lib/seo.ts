import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site'

export type SEOProps = {
  title?: string | null
  description?: string | null
  /** Path without leading slash, e.g. 'contact' or 'privacy' */
  path?: string
  /** Absolute or path-only image URL for OG/Twitter. Defaults to site OG image. */
  image?: string | null
  /** If true, sets noindex, nofollow. Use for login, signup, dashboard. */
  noIndex?: boolean
  /** Override type for OG (default 'website'). */
  type?: 'website' | 'article'
}

const defaultImage = '/hero1.png'

function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * Build Next.js Metadata for a page. Use in layout or page metadata export.
 */
export function buildMetadata(options: SEOProps = {}): Metadata {
  const {
    title,
    description,
    path = '',
    image = defaultImage,
    noIndex = false,
    type = 'website',
  } = options

  const fullTitle = title ? `${title} | ${siteConfig.shortName}` : siteConfig.shortName
  const desc = description ?? siteConfig.description
  const canonicalUrl = path ? absoluteUrl(path) : siteConfig.url
  const imageUrl = image.startsWith('http') ? image : absoluteUrl(image)
  const setCanonical = !noIndex || !!path

  const metadata: Metadata = {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(siteConfig.url),
    ...(setCanonical && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
    openGraph: {
      title: fullTitle,
      description: desc,
      type,
      url: canonicalUrl,
      siteName: siteConfig.shortName,
      locale: siteConfig.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: siteConfig.tagline,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [imageUrl],
      creator: siteConfig.twitterHandle,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }

  return metadata
}

/**
 * JSON-LD Organization + WebSite for the root layout.
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteConfig.url}/#organization`,
        name: siteConfig.organization.name,
        url: siteConfig.organization.url,
        logo: siteConfig.organization.logo,
        description: siteConfig.descriptionShort,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        name: siteConfig.shortName,
        url: siteConfig.url,
        description: siteConfig.description,
        publisher: { '@id': `${siteConfig.url}/#organization` },
        inLanguage: siteConfig.locale,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${siteConfig.url}/?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }
}
