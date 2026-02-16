'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * Get all users - only accessible by SUPER_ADMIN
 */
export async function getAllUsers() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's role
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError || !currentUser) {
      return { data: [], error: 'User profile not found' }
    }

    // Only SUPER_ADMIN can access this; use RPC to avoid RLS that references users (redirect loop)
    if (currentUser.role !== 'SUPER_ADMIN') {
      return { data: [], error: 'Unauthorized' }
    }

    const { data: users, error } = await supabase.rpc('get_all_users_for_super_admin', {
      requestor_id: user.id,
    })

    if (error) {
      return { data: [], error: error.message }
    }

    const formattedUsers = (users ?? []).map((u: { id: string; email: string; name: string; role: string; avatar: string | null; company_id: string | null; created_at: string; company_name: string }) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      companyId: u.company_id,
      companyName: u.company_name ?? 'No Company',
      createdAt: u.created_at,
    }))

    return { data: formattedUsers, error: null }
  } catch (error) {
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Update user role - only accessible by SUPER_ADMIN
 */
export async function updateUserRole(userId: string, newRole: 'SUPER_ADMIN' | 'HR' | 'EMPLOYEE') {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's role
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError || !currentUser) {
      return { error: 'User profile not found' }
    }

    // Only SUPER_ADMIN can update roles
    if (currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'Unauthorized' }
    }

    // Prevent changing own role
    if (userId === user.id) {
      return { error: 'You cannot change your own role' }
    }

    const dbRole = newRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : newRole === 'HR' ? 'HR' : 'EMPLOYEE'
    const { error: updateError } = await supabase.rpc('update_user_role_as_super_admin', {
      requestor_id: user.id,
      target_user_id: userId,
      new_role: dbRole,
    })

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
