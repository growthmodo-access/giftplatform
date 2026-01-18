import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

// Initialize Supabase client for browser
// Uses SSR-compatible client to ensure cookies sync with middleware
const supabaseUrl = env.supabase.url
const supabaseAnonKey = env.supabase.anonKey

// #region agent log
if (typeof window !== 'undefined') {
  fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase/client.ts:8',message:'Initializing Supabase client',data:{hasUrl:!!supabaseUrl,hasAnonKey:!!supabaseAnonKey,urlLength:supabaseUrl?.length || 0,keyLength:supabaseAnonKey?.length || 0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
}
// #endregion

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)
