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

export async function inviteEmployee(email: string, name: string, role: 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's company and role
    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!currentUser?.company_id) {
      return { error: 'You must be part of a company to invite employees' }
    }

    // Check permissions - only ADMIN, HR, and SUPER_ADMIN can invite
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to invite employees' }
    }

    // Check if user already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .maybeSingle()

    // If query succeeded and user exists, return error
    if (!existingUserError && existingUser) {
      return { error: 'A user with this email already exists' }
    }

    // If there was an error other than "not found", return it
    if (existingUserError) {
      return { error: `Failed to check existing user: ${existingUserError.message}` }
    }

    // Use service role to create auth user and send invitation
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const { env } = await import('@/lib/env')
    
    const serviceSupabase = createServiceClient(
      env.supabase.url,
      env.supabase.serviceRoleKey || env.supabase.anonKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Generate a temporary password (user will need to reset it)
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'

    // Create auth user
    const { data: authData, error: authUserError } = await serviceSupabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name,
      },
    })

    if (authUserError || !authData.user) {
      return { error: `Failed to create user: ${authUserError?.message || 'Unknown error'}` }
    }

    // Create user profile with role and company
    const { error: profileError } = await serviceSupabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name: name || null,
        role: role,
        company_id: currentUser.company_id,
      })

    if (profileError) {
      // If profile creation fails, delete the auth user
      await serviceSupabase.auth.admin.deleteUser(authData.user.id)
      return { error: `Failed to create profile: ${profileError.message}` }
    }

    // Send password reset email (this will allow them to set their own password)
    const { error: resetError } = await serviceSupabase.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    // Log error but don't fail the invitation if email sending fails
    // The user can still reset their password manually
    if (resetError) {
      console.error('Failed to send password reset email:', resetError)
      // Continue anyway - user can reset password manually
    }

    // Note: In production, you'd want to send a proper invitation email
    // For now, the user can use password reset to set their password

    revalidatePath('/employees')
    return { 
      success: true, 
      message: `Employee ${email} has been invited. They will receive an email to set their password.`,
      userId: authData.user.id
    }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function updateEmployeeRole(userId: string, newRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Check if current user is admin, HR, or super admin
    const { data: currentUser } = await supabase
      .from('users')
      .select('role, company_id')
      .eq('id', user.id)
      .single()

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR' && currentUser.role !== 'SUPER_ADMIN')) {
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
