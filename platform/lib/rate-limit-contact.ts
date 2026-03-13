/**
 * Simple in-memory rate limit for contact form: max 5 submissions per IP per hour.
 * For production at scale, use Redis or Vercel KV.
 */

const store = new Map<string, { count: number; resetAt: number }>()
const MAX_PER_HOUR = 5
const WINDOW_MS = 60 * 60 * 1000

function getKey(ip: string): string {
  return `contact:${ip}`
}

function cleanup(): void {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key)
  }
}

export function checkContactRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  cleanup()
  const key = getKey(ip)
  const entry = store.get(key)
  const now = Date.now()

  if (!entry) {
    return { allowed: true }
  }

  if (entry.resetAt < now) {
    store.delete(key)
    return { allowed: true }
  }

  if (entry.count >= MAX_PER_HOUR) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  return { allowed: true }
}

export function recordContactSubmission(ip: string): void {
  cleanup()
  const key = getKey(ip)
  const entry = store.get(key)
  const now = Date.now()
  const resetAt = now + WINDOW_MS

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt })
  } else {
    entry.count += 1
  }
}
