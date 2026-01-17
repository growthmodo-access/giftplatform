import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

// Initialize Supabase client for browser
// Uses SSR-compatible client to ensure cookies sync with middleware
export const supabase = createBrowserClient(
  env.supabase.url,
  env.supabase.anonKey
)
