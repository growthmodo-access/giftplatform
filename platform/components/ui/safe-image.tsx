'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined
  alt: string
  fallback?: React.ReactNode
  className?: string
  containerClassName?: string
}

/**
 * Renders an image with fallback when load fails (e.g. Supabase storage CORS/403).
 * Use referrerPolicy="no-referrer" to avoid referrer blocking on some CDNs.
 */
export function SafeImage({
  src,
  alt,
  fallback,
  className,
  containerClassName,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          containerClassName,
          className
        )}
      >
        {fallback ?? null}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
      {...props}
    />
  )
}
