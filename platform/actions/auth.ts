'use server'

import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Create user profile after signup
 * Uses service role key to bypass RLS if available, otherwise uses regular client
 */
export async function createUserProfile(userId: string, email: string, name?: string) {
  // Try using service role key first (bypasses RLS)
  // If not available, use regular client (should work if user session is established)
  const supabaseUrl = env.supabase.url
  const supabaseKey = env.supabase.serviceRoleKey || env.supabase.anonKey
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  
  const { error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
      name: name || null,
      role: 'EMPLOYEE',
    })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
