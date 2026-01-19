'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * Get all companies
 * SUPER_ADMIN can see all companies
 * ADMIN can see their own company
 */
export async function getCompanies() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's role and company
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('role, company_id')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError || !currentUser) {
      return { data: [], error: 'User profile not found' }
    }

    // Check permissions - only ADMIN and SUPER_ADMIN can view companies
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      return { data: [], error: 'You do not have permission to view companies' }
    }

    let query = supabase
      .from('companies')
      .select('id, name, domain, budget, logo, created_at, updated_at')
      .order('created_at', { ascending: false })

    // SUPER_ADMIN can see all companies
    // ADMIN can only see their own company
    if (currentUser.role === 'ADMIN') {
      if (!currentUser.company_id) {
        return { data: [], error: null }
      }
      query = query.eq('id', currentUser.company_id)
    }

    const { data: companies, error } = await query

    if (error) {
      return { data: [], error: error.message }
    }

    // Get employee counts for each company
    const companyIds = companies?.map(c => c.id) || []
    const { data: employees } = await supabase
      .from('users')
      .select('company_id')
      .in('company_id', companyIds)

    const employeeCounts = employees?.reduce((acc, emp) => {
      if (emp.company_id) {
        acc[emp.company_id] = (acc[emp.company_id] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    // Get order counts and revenue for each company
    const { data: orders } = await supabase
      .from('orders')
      .select('company_id, total')
      .in('company_id', companyIds)

    const orderStats = orders?.reduce((acc, order) => {
      if (order.company_id) {
        if (!acc[order.company_id]) {
          acc[order.company_id] = { orders: 0, revenue: 0 }
        }
        acc[order.company_id].orders += 1
        acc[order.company_id].revenue += Number(order.total || 0)
      }
      return acc
    }, {} as Record<string, { orders: number; revenue: number }>) || {}

    const companiesWithStats = companies?.map(company => ({
      ...company,
      employeeCount: employeeCounts[company.id] || 0,
      orderCount: orderStats[company.id]?.orders || 0,
      revenue: orderStats[company.id]?.revenue || 0,
    })) || []

    return { data: companiesWithStats, error: null }
  } catch (error) {
    console.error('Get companies error:', error)
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch companies'
    }
  }
}

/**
 * Create a new company
 * Only SUPER_ADMIN can create companies
 */
export async function createCompany(formData: FormData) {
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

    // Check permissions - only SUPER_ADMIN and ADMIN can create companies
    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'ADMIN') {
      return { error: 'You do not have permission to create companies. Only Super Admins and Admins can create companies.' }
    }

    const name = formData.get('name') as string
    const domain = formData.get('domain') as string
    const budget = formData.get('budget') as string
    const taxId = formData.get('tax_id') as string
    const currency = formData.get('currency') as string || 'USD'
    const billingAddressStr = formData.get('billing_address') as string

    if (!name || !budget) {
      return { error: 'Company name and budget are required' }
    }

    const budgetNum = parseFloat(budget)
    if (isNaN(budgetNum) || budgetNum < 0) {
      return { error: 'Budget must be a valid positive number' }
    }

    let billingAddress = null
    if (billingAddressStr) {
      try {
        billingAddress = JSON.parse(billingAddressStr)
      } catch (e) {
        console.error('Invalid billing address JSON:', e)
      }
    }

    // Generate unique store identifier from company name
    const storeIdentifier = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36)

    const { data: newCompany, error: createError } = await supabase
      .from('companies')
      .insert({
        name: name.trim(),
        domain: domain.trim() || null,
        budget: budgetNum,
        tax_id: taxId?.trim() || null,
        currency: currency || 'USD',
        billing_address: billingAddress,
        store_identifier: storeIdentifier,
      })
      .select()
      .single()

    if (createError) {
      return { error: createError.message }
    }

    revalidatePath('/companies')
    return { success: true, data: newCompany }
  } catch (error) {
    console.error('Create company error:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create company'
    }
  }
}

/**
 * Update company information
 * SUPER_ADMIN can update any company
 * ADMIN can only update their own company
 */
export async function updateCompany(companyId: string, formData: FormData) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's role and company
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('role, company_id')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError || !currentUser) {
      return { error: 'User profile not found' }
    }

    // Check permissions
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to update companies' }
    }

    // ADMIN can only update their own company
    if (currentUser.role === 'ADMIN' && currentUser.company_id !== companyId) {
      return { error: 'You can only update your own company' }
    }

    const name = formData.get('name') as string
    const domain = formData.get('domain') as string
    const budget = formData.get('budget') as string
    const taxId = formData.get('tax_id') as string
    const currency = formData.get('currency') as string
    const billingAddressStr = formData.get('billing_address') as string

    const updates: {
      name?: string
      domain?: string | null
      budget?: number
      tax_id?: string | null
      currency?: string
      billing_address?: any
      updated_at: string
    } = {
      updated_at: new Date().toISOString(),
    }

    if (name) {
      updates.name = name.trim()
    }

    if (domain !== undefined) {
      updates.domain = domain.trim() || null
    }

    if (budget) {
      const budgetNum = parseFloat(budget)
      if (!isNaN(budgetNum) && budgetNum >= 0) {
        updates.budget = budgetNum
      }
    }

    if (taxId !== undefined) {
      updates.tax_id = taxId.trim() || null
    }

    if (currency) {
      updates.currency = currency
    }

    if (billingAddressStr) {
      try {
        updates.billing_address = JSON.parse(billingAddressStr)
      } catch (e) {
        console.error('Invalid billing address JSON:', e)
      }
    }

    const { error: updateError } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', companyId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/companies')
    return { success: true }
  } catch (error) {
    console.error('Update company error:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update company'
    }
  }
}
