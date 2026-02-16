'use server'

import { createClient } from '@/lib/supabase/server'
import { isCompanyHRDb } from '@/lib/roles'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { AppRole } from '@/lib/roles'

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

export async function inviteEmployee(email: string, name: string, role: 'SUPER_ADMIN' | 'HR' | 'EMPLOYEE', shippingAddress?: string | null, companyId?: string | null) {
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

    const { isCompanyHRDb } = await import('@/lib/roles')
    if (currentUser.role !== 'SUPER_ADMIN' && !isCompanyHRDb(currentUser.role)) {
      return { error: 'You do not have permission to invite employees' }
    }
    if (currentUser.role !== 'SUPER_ADMIN' && !currentUser?.company_id) {
      return { error: 'You must be part of a company to invite employees' }
    }
    // Only SUPER_ADMIN can invite SUPER_ADMIN
    if (role === 'SUPER_ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'Only Super Admins can invite Super Admins.' }
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
    // SUPER_ADMIN can invite to any company via companyId parameter
    // Other roles use their own company_id
    const finalCompanyId = companyId || currentUser?.company_id || null
    
    // Validate company_id for SUPER_ADMIN
    if (currentUser.role === 'SUPER_ADMIN' && companyId) {
      const { data: companyExists } = await supabase
        .from('companies')
        .select('id')
        .eq('id', companyId)
        .single()
      
      if (!companyExists) {
        return { error: 'Selected company does not exist' }
      }
    }
    
    const { error: profileError } = await serviceSupabase
      .from('users')
      .upsert(
        {
          id: authData.user.id,
          email,
          name: name || null,
          role: role,
          company_id: finalCompanyId,
        },
        { onConflict: 'id' }
      )

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

export async function updateEmployeeRole(userId: string, newRole: 'SUPER_ADMIN' | 'HR' | 'EMPLOYEE') {
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

    const { isCompanyHRDb } = await import('@/lib/roles')
    const canManageRoles = currentUser.role === 'SUPER_ADMIN' || isCompanyHRDb(currentUser.role)
    if (!currentUser || !canManageRoles) {
      return { error: 'You do not have permission to update roles' }
    }

    const { data: targetUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', userId)
      .single()

    if (!targetUser || targetUser.company_id !== currentUser.company_id) {
      return { error: 'User not found or not in your company' }
    }

    // Only SUPER_ADMIN can assign SUPER_ADMIN
    if (newRole === 'SUPER_ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'Only Super Admins can assign the Super Admin role.' }
    }

    // Store one of SUPER_ADMIN | HR | EMPLOYEE in DB
    const dbRole = newRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : newRole === 'HR' ? 'HR' : 'EMPLOYEE'
    const { error } = await supabase
      .from('users')
      .update({
        role: dbRole,
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

export async function importEmployeesFromCSV(formData: FormData) {
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

    if (currentUserError || !currentUser) {
      return { error: 'User profile not found' }
    }

    const { isCompanyHRDb } = await import('@/lib/roles')
    if (currentUser.role !== 'SUPER_ADMIN' && !isCompanyHRDb(currentUser.role)) {
      return { error: 'You do not have permission to import employees' }
    }

    const csvFile = formData.get('csv') as File
    if (!csvFile) {
      return { error: 'No CSV file provided' }
    }

    // Read CSV file
    const text = await csvFile.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return { error: 'CSV file must have at least a header row and one data row' }
    }

    // Parse header
    const header = lines[0].split(',').map(h => h.trim().toLowerCase())
    const emailIndex = header.indexOf('email')
    const nameIndex = header.indexOf('name')
    const roleIndex = header.indexOf('role')
    const shippingIndex = header.indexOf('shipping_address')

    if (emailIndex === -1 || nameIndex === -1 || roleIndex === -1) {
      return { error: 'CSV must have email, name, and role columns' }
    }

    // Parse CSV rows (skip header)
    const employees = []
    const errors: string[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Handle quoted fields (simple CSV parsing)
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const email = values[emailIndex]?.trim()
      const name = values[nameIndex]?.trim()
      const role = values[roleIndex]?.trim().toUpperCase()
      const shippingAddress = shippingIndex >= 0 ? values[shippingIndex]?.trim() : ''

      if (!email || !name || !role) {
        errors.push(`Row ${i + 1}: Missing required fields`)
        continue
      }

      // Normalize to 3 roles: map ADMIN/MANAGER to HR for CSV
      const normalizedRole = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : (role === 'ADMIN' || role === 'MANAGER' || role === 'HR') ? 'HR' : 'EMPLOYEE'
      if (!['SUPER_ADMIN', 'HR', 'EMPLOYEE'].includes(normalizedRole)) {
        errors.push(`Row ${i + 1}: Invalid role "${role}" (use Super Admin, Company HR, or Employee)`)
        continue
      }
      if (normalizedRole === 'SUPER_ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
        errors.push(`Row ${i + 1}: Only Super Admins can invite Super Admins`)
        continue
      }
      employees.push({ email, name, role: normalizedRole, shippingAddress })
    }

    if (employees.length === 0) {
      return { error: 'No valid employees found in CSV file' + (errors.length > 0 ? '. Errors: ' + errors.join('; ') : '') }
    }

    // Use service role to create users
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

    const companyId = currentUser?.company_id || null
    let successCount = 0
    const failed: string[] = []

    // Create employees
    for (const emp of employees) {
      try {
        // Check if user exists
        const { data: existingUser } = await serviceSupabase
          .from('users')
          .select('id')
          .eq('email', emp.email)
          .maybeSingle()

        if (existingUser) {
          failed.push(`${emp.email}: User already exists`)
          continue
        }

        // Create auth user
        const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'
        const { data: authData, error: authError } = await serviceSupabase.auth.admin.createUser({
          email: emp.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { name: emp.name },
        })

        if (authError || !authData.user) {
          failed.push(`${emp.email}: ${authError?.message || 'Failed to create user'}`)
          continue
        }

        // Create user profile
        const { error: profileError } = await serviceSupabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: emp.email,
            name: emp.name,
            role: emp.role as any,
            company_id: companyId,
          })

        if (profileError) {
          await serviceSupabase.auth.admin.deleteUser(authData.user.id)
          failed.push(`${emp.email}: ${profileError.message}`)
          continue
        }

        // Create shipping address if provided
        if (emp.shippingAddress) {
          await serviceSupabase
            .from('addresses')
            .insert({
              user_id: authData.user.id,
              street: emp.shippingAddress,
              type: 'SHIPPING',
            })
            .catch(() => {
              // Ignore address creation errors
            })
        }

        successCount++
      } catch (err) {
        failed.push(`${emp.email}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    revalidatePath('/employees')
    
    let message = `Successfully imported ${successCount} employee(s)`
    if (failed.length > 0) {
      message += `. ${failed.length} failed: ${failed.slice(0, 3).join(', ')}${failed.length > 3 ? '...' : ''}`
    }
    if (errors.length > 0) {
      message += `. ${errors.length} row error(s)`
    }

    return { 
      success: true, 
      count: successCount,
      message,
      errors: errors.length > 0 ? errors : undefined,
      failed: failed.length > 0 ? failed : undefined,
    }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
