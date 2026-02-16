'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/d22e37f8-4626-40d8-a25a-149d05f68c5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/error.tsx',message:'Error boundary rendered',data:{message:error?.message,digest:error?.digest},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    if (process.env.NODE_ENV === 'production') {
      console.error('Application error:', error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 min-w-0 w-full">
      <div className="w-full max-w-md space-y-4 text-center min-w-0">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button asChild variant="outline">
            <a href="/">Go Home</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/dashboard">Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
