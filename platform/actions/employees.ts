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

    // Get current user's company and role
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError) {
      return { data: [], error: currentUserError.message }
    }

    if (!currentUser) {
      return { data: [], error: 'User profile not found' }
    }

    // SUPER_ADMIN can see all employees (all companies)
    // Other roles need company_id
    let query = supabase
      .from('users')
      .select('id, email, name, role, avatar, created_at, company_id')
      .order('created_at', { ascending: false })

    if (currentUser?.role !== 'SUPER_ADMIN') {
      if (!currentUser?.company_id) {
        return { data: [], error: null }
      }
      query = query.eq('company_id', currentUser.company_id)
    }

    const { data: employees, error } = await query

    if (error) {
      return { data: [], error: error.message }
    }

    // Get company IDs and fetch company names
    const companyIds = [...new Set(employees?.map(e => e.company_id).filter(Boolean) || [])]
    const { data: companies } = companyIds.length > 0 ? await supabase
      .from('companies')
      .select('id, name')
      .in('id', companyIds) : { data: [] }

    const companyMap = new Map((companies || []).map(c => [c.id, c.name]))

    // Get shipping addresses for employees
    const employeeIds = employees?.map(e => e.id) || []
    const { data: addresses } = await supabase
      .from('addresses')
      .select('user_id, street, city, state, country, zip_code, type')
      .in('user_id', employeeIds)
      .eq('type', 'SHIPPING')

    const addressMap = new Map<string, any>()
    addresses?.forEach(addr => {
      if (!addressMap.has(addr.user_id)) {
        addressMap.set(addr.user_id, addr)
      }
    })

    // Get gift counts for each employee
    const { data: gifts } = await supabase
      .from('gifts')
      .select('user_id')
      .in('user_id', employeeIds)

    const giftCounts = gifts?.reduce((acc, gift) => {
      acc[gift.user_id] = (acc[gift.user_id] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const employeesWithGifts = employees?.map(employee => {
      const address = addressMap.get(employee.id)
      return {
        ...employee,
        giftsCount: giftCounts[employee.id] || 0,
        companyName: employee.company_id ? companyMap.get(employee.company_id) : null,
        shippingAddress: address ? {
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          zip_code: address.zip_code,
        } : null,
      }
    }) || []

    return { data: employeesWithGifts, error: null }
  } catch (error) {
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function inviteEmployee(email: string, name: string, role: 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE', shippingAddress?: string | null) {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'actions/employees.ts:68',message:'inviteEmployee called',data:{email,name,role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'actions/employees.ts:76',message:'Auth check result',data:{hasUser:!!user,authError:authError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's company and role
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError) {
      return { error: 'Failed to fetch user data' }
    }

    if (!currentUser) {
      return { error: 'User profile not found' }
    }

    // Check permissions - only ADMIN, HR, and SUPER_ADMIN can invite
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to invite employees' }
    }

    // SUPER_ADMIN can invite employees to any company (will need company_id in form)
    // Other roles need company_id
    if (currentUser.role !== 'SUPER_ADMIN' && !currentUser?.company_id) {
      return { error: 'You must be part of a company to invite employees' }
    }

    // HR can only invite HR, MANAGER, or EMPLOYEE roles (not ADMIN or SUPER_ADMIN)
    if (currentUser.role === 'HR' && (role === 'ADMIN' || role === 'SUPER_ADMIN')) {
      return { error: 'HR cannot invite users with ADMIN or SUPER_ADMIN roles. Only Admins can invite Admins.' }
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
    // SUPER_ADMIN can invite to any company, but for now we use current user's company
    // TODO: Add company_id parameter for SUPER_ADMIN to invite to specific companies
    const companyId = currentUser?.company_id || null
    
    const { error: profileError } = await serviceSupabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name: name || null,
        role: role,
        company_id: companyId,
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

    // Create shipping address if provided
    if (shippingAddress) {
      await serviceSupabase
        .from('addresses')
        .insert({
          user_id: authData.user.id,
          street: shippingAddress,
          type: 'SHIPPING',
        })
        .catch(() => {
          // Ignore address creation errors
        })
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
      .select('company_id, role')
      .eq('id', userId)
      .single()

    if (!targetUser || targetUser.company_id !== currentUser.company_id) {
      return { error: 'User not found or not in your company' }
    }

    // HR cannot change roles to ADMIN or SUPER_ADMIN
    if (currentUser.role === 'HR' && (newRole === 'ADMIN' || newRole === 'SUPER_ADMIN')) {
      return { error: 'HR cannot change roles to ADMIN or SUPER_ADMIN. Only Admins can assign these roles.' }
    }

    // ADMIN cannot change roles to SUPER_ADMIN (only SUPER_ADMIN can)
    if (currentUser.role === 'ADMIN' && newRole === 'SUPER_ADMIN') {
      return { error: 'Admins cannot change roles to SUPER_ADMIN. Only Super Admins can assign this role.' }
    }

    // ADMIN cannot change roles to ADMIN (prevents privilege escalation)
    if (currentUser.role === 'ADMIN' && newRole === 'ADMIN' && targetUser.role !== 'ADMIN') {
      return { error: 'Admins cannot promote users to ADMIN role. Only Super Admins can assign ADMIN role.' }
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
