'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Supabase recovery links sometimes land on Site URL (e.g. "/") with tokens in hash/query.
 * If recovery intent is detected, send user to /reset-password while preserving params/hash.
 */
export function RecoveryLinkRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (pathname === '/reset-password') return

    const hash = window.location.hash || ''
    const search = window.location.search || ''
    const combined = `${search}${hash}`.toLowerCase()
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    const isRecovery = combined.includes('type=recovery')

    // If Supabase drops user on Site URL with ?code=..., pass through callback to exchange code.
    if (code) {
      const next = encodeURIComponent('/reset-password')
      router.replace(`/api/auth/callback?code=${encodeURIComponent(code)}&type=recovery&next=${next}`)
      return
    }

    if (!isRecovery) return

    // Keep tokens so Supabase client can establish recovery session on reset page.
    router.replace(`/reset-password${search}${hash}`)
  }, [pathname, router])

  return null
}
