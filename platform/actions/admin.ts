'use server'

import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Update user role by email
 * This uses the service role key to bypass RLS for admin operations
 * Use with caution - only for administrative tasks
 */
/** Allowed roles: 3 only. Legacy ADMIN/MANAGER are normalized to HR. */
export async function updateUserRoleByEmail(email: string, role: 'SUPER_ADMIN' | 'HR' | 'EMPLOYEE') {
  try {
    const supabaseUrl = env.supabase.url
    const supabaseKey = env.supabase.serviceRoleKey || env.supabase.anonKey
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('email', email)
      .single()

    if (findError || !user) {
      return { error: `User with email ${email} not found` }
    }

    const dbRole = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : role === 'HR' ? 'HR' : 'EMPLOYEE'
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        role: dbRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      return { error: updateError.message }
    }

    return { 
      success: true, 
      data: updatedUser,
      message: `Successfully updated ${email} to ${dbRole}` 
    }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
