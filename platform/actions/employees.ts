'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getEmployees() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's company
    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!currentUser?.company_id) {
      return { data: [], error: null }
    }

    // Get all employees in the same company
    const { data: employees, error } = await supabase
      .from('users')
      .select('id, email, name, role, avatar, created_at')
      .eq('company_id', currentUser.company_id)
      .order('created_at', { ascending: false })

    if (error) {
      return { data: [], error: error.message }
    }

    // Get gift counts for each employee
    const employeeIds = employees?.map(e => e.id) || []
    const { data: gifts } = await supabase
      .from('gifts')
      .select('user_id')
      .in('user_id', employeeIds)

    const giftCounts = gifts?.reduce((acc, gift) => {
      acc[gift.user_id] = (acc[gift.user_id] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const employeesWithGifts = employees?.map(employee => ({
      ...employee,
      giftsCount: giftCounts[employee.id] || 0,
    })) || []

    return { data: employeesWithGifts, error: null }
  } catch (error) {
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function updateEmployeeRole(userId: string, newRole: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE') {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Check if current user is admin or super admin
    const { data: currentUser } = await supabase
      .from('users')
      .select('role, company_id')
      .eq('id', user.id)
      .single()

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return { error: 'You do not have permission to update roles' }
    }

    // Verify the target user is in the same company
    const { data: targetUser } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single()

    if (!targetUser || targetUser.company_id !== currentUser.company_id) {
      return { error: 'User not found or not in your company' }
    }

    // Update the role
    const { error } = await supabase
      .from('users')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/employees')
    return { success: true }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
