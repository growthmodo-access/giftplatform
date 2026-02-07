import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'
import { CSSVariablesCheck } from '@/components/css-variables-check'
import { TooltipProviderWrapper } from '@/components/tooltip-provider-wrapper'
import { Toaster } from '@/components/ui/toaster'
import { buildMetadata, getOrganizationJsonLd } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

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

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Global Gifting & Swag Platform',
    description: siteConfig.description,
    path: '',
    image: '/hero1.png',
  }),
  keywords: ['corporate gifting', 'employee gifting', 'swag platform', 'corporate gifts', 'global gifting', 'HR gifting', 'client gifts', 'employee engagement'],
  authors: [{ name: siteConfig.shortName, url: siteConfig.url }],
  creator: siteConfig.shortName,
  icons: {
    icon: '/goodies.png',
    shortcut: '/goodies.png',
    apple: '/goodies.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  charset: 'utf-8',
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${dmSans.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationJsonLd()) }}
        />
        <CSSVariablesCheck />
        <ErrorBoundary>
          <TooltipProviderWrapper>
            <Providers>{children}</Providers>
            <Toaster />
          </TooltipProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  )
}
