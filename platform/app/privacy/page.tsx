import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Privacy policy for Goodies. How we collect, use, and protect your information when you use our corporate gifting platform.',
  path: 'privacy',
})

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border/60 py-4">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="text-primary font-semibold hover:underline">
            ← Goodies.so
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <p>
            Goodies.so (&quot;we&quot;, &quot;our&quot;) is committed to protecting your privacy. This policy describes how we collect, use, and safeguard your information when you use our corporate gifting platform.
          </p>
          <h2 id="cookies" className="text-lg font-semibold mt-8">Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. We may use analytics cookies to improve our product. You can manage cookie preferences in your browser.
          </p>
          <h2 className="text-lg font-semibold mt-8">Data we collect</h2>
          <p>
            We collect account data (name, email, company), order and shipping details, and usage data necessary to provide and improve our service.
          </p>
          <h2 className="text-lg font-semibold mt-8">Contact</h2>
          <p>
            For privacy requests or questions: <a href="mailto:privacy@goodies.so" className="text-primary hover:underline">privacy@goodies.so</a>
          </p>
        </div>
        <p className="mt-10">
          <Link href="/" className="text-primary font-medium hover:underline">Back to home</Link>
        </p>
      </main>
    </div>
  )
}
