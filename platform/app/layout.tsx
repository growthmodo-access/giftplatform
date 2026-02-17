import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'
import { CSSVariablesCheck } from '@/components/css-variables-check'
import { TooltipProviderWrapper } from '@/components/tooltip-provider-wrapper'
import { Toaster } from '@/components/ui/toaster'
import { buildMetadata, getOrganizationJsonLd } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Global Gifting & Swag Platform',
    description: siteConfig.description,
    path: '',
    image: '/MAINIMAGE.PNG',
  }),
  keywords: ['corporate gifting', 'employee gifting', 'swag platform', 'corporate gifts', 'global gifting', 'HR gifting', 'client gifts', 'employee engagement'],
  authors: [{ name: siteConfig.shortName, url: siteConfig.url }],
  creator: siteConfig.shortName,
  icons: {
    icon: 'https://raw.githubusercontent.com/growthmodo-access/giftplatform/1daacc961fb9e62657368e76e850eaa74117d386/platform/public/goodies.png',
    shortcut: 'https://raw.githubusercontent.com/growthmodo-access/giftplatform/1daacc961fb9e62657368e76e850eaa74117d386/platform/public/goodies.png',
    apple: 'https://raw.githubusercontent.com/growthmodo-access/giftplatform/1daacc961fb9e62657368e76e850eaa74117d386/platform/public/goodies.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#7B61FF',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fustat:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T8NBHV4B');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className="font-sans antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T8NBHV4B"
            height={0}
            width={0}
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
