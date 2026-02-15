import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description: `Terms of service for ${siteConfig.name} (${siteConfig.companyLegalName}). By using our corporate gifting platform you agree to these terms.`,
  path: 'terms',
})

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border/60 py-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/" className="text-primary font-semibold hover:underline">
            ← {siteConfig.name}
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <p>
            By using {siteConfig.name}, you agree to these terms. {siteConfig.companyLegalName} provides the platform for corporate gifting, swag, and campaign tools for businesses.
          </p>
          <h2 className="text-lg font-semibold mt-8">Use of the service</h2>
          <p>
            You must use the service in compliance with applicable laws and not misuse or attempt to gain unauthorized access to our systems or data.
          </p>
          <h2 className="text-lg font-semibold mt-8">Orders and payments</h2>
          <p>
            Orders are subject to availability and our fulfilment partners&apos; terms. Payment terms are as agreed in your plan or invoice.
          </p>
          <h2 className="text-lg font-semibold mt-8">Contact</h2>
          <p>
            For questions: <a href={`mailto:${siteConfig.supportEmail}`} className="text-primary hover:underline">{siteConfig.supportEmail}</a> or call <a href={`tel:${siteConfig.supportPhone.replace(/\s/g, '')}`} className="text-primary hover:underline">{siteConfig.supportPhone}</a>.
          </p>
        </div>
        <p className="mt-10">
          <Link href="/" className="text-primary font-medium hover:underline">Back to home</Link>
        </p>
      </main>
    </div>
  )
}
