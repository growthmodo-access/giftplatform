import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Home, LayoutDashboard } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Page not found',
  description: 'The page you\'re looking for doesn\'t exist or has been moved.',
  noIndex: true,
})

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 min-w-0 w-full">
      <div className="w-full max-w-md space-y-6 text-center min-w-0 px-2">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground" aria-hidden>404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page not found</h2>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" aria-hidden />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
