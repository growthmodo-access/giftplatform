'use client'

/**
 * Renders a JSON-LD script tag. Use for page-specific structured data
 * (e.g. FAQPage, Product, Article). Root Organization/WebSite is in layout.
 */
export function JsonLd<T extends Record<string, unknown>>({ data }: { data: T }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
