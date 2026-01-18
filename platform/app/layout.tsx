import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Goodies.so - Global Gifting & Swag Platform',
  description: 'Boost engagement globally, send premium swag and gifts. Improve your culture and increase sales, all in one global gifting platform.',
  keywords: ['employee gifting', 'swag platform', 'corporate gifts', 'global gifting', 'employee engagement'],
  authors: [{ name: 'Goodies.so' }],
  openGraph: {
    title: 'Goodies.so - Global Gifting & Swag Platform',
    description: 'Boost engagement globally, send premium swag and gifts.',
    type: 'website',
    url: 'https://goodies.so',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goodies.so - Global Gifting & Swag Platform',
    description: 'Boost engagement globally, send premium swag and gifts.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  charset: 'utf-8',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans`}>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
