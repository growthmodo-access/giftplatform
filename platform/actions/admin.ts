'use server'

import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Update user role by email
 * This uses the service role key to bypass RLS for admin operations
 * Use with caution - only for administrative tasks
 */
export async function updateUserRoleByEmail(email: string, role: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') {
  try {
    // Use service role key to bypass RLS
    const supabaseUrl = env.supabase.url
    const supabaseKey = env.supabase.serviceRoleKey || env.supabase.anonKey
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // First, find the user by email
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('email', email)
      .single()

    if (findError || !user) {
      return { error: `User with email ${email} not found` }
    }

    // Update the role
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ 
        role: role,
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
      message: `Successfully updated ${email} to ${role}` 
    }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
