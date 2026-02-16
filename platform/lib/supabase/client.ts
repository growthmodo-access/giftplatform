import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

// Initialize Supabase client for browser
// Uses SSR-compatible client to ensure cookies sync with middleware
// Lazy initialization to avoid build-time errors when env vars aren't available
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  try {
    const supabaseUrl = env.supabase.url
    const supabaseAnonKey = env.supabase.anonKey

    // #region agent log
    if (!supabaseUrl || !supabaseAnonKey) {
      fetch('http://127.0.0.1:7245/ingest/d22e37f8-4626-40d8-a25a-149d05f68c5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase/client.ts:getSupabaseClient',message:'Supabase env missing',data:{hasUrl:!!supabaseUrl,hasAnonKey:!!supabaseAnonKey},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      throw new Error('Supabase URL and API key are required')
    }
    // #endregion

    supabaseInstance = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey
    )
    return supabaseInstance
  } catch (error) {
    // During build time, env vars might not be available
    // Return a mock client that will fail gracefully
    if (typeof window === 'undefined') {
      throw new Error('Supabase client cannot be initialized during build. This page should be dynamic.')
    }
    throw error
  }
}

export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof ReturnType<typeof createBrowserClient>]
  }
})
