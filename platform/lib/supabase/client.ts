import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

// Initialize Supabase client
// During build, env vars may be empty - Supabase client creation should still work
// Runtime errors will occur if env vars are missing when actually used
export const supabase = createClient(env.supabase.url, env.supabase.anonKey)
