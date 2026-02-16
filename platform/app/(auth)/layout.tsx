import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Goodies account to manage corporate gifting, swag, and campaigns.',
  robots: { index: false, follow: true },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-primary text-white py-2.5 sm:py-3 text-center text-xs sm:text-sm font-medium w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <span className="block sm:inline">
            Corporate gifting for HR & Ops—one platform, 100+ locations.{' '}
            <Link href="/contact" className="underline font-semibold text-white/95 hover:text-white decoration-2 underline-offset-2">
              Talk to sales
            </Link>
          </span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6">
        {children}
      </div>
    </div>
  )
}
