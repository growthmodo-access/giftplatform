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

    // Only SUPER_ADMIN can access this
    if (currentUser.role !== 'SUPER_ADMIN') {
      return { data: [], error: 'Unauthorized' }
    }

    // Get all users with company information
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        role,
        avatar,
        company_id,
        created_at,
        companies:company_id (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return { data: [], error: error.message }
    }

    // Format users with company name
    const formattedUsers = users?.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      companyId: u.company_id,
      companyName: (u.companies as any)?.name || 'No Company',
      createdAt: u.created_at,
    })) || []

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
export async function updateUserRole(userId: string, newRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') {
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

    // Update the role
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

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
