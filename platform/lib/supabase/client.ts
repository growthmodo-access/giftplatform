import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

// Initialize Supabase client for browser
// Uses SSR-compatible client to ensure cookies sync with middleware
const supabaseUrl = env.supabase.url
const supabaseAnonKey = env.supabase.anonKey

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)
