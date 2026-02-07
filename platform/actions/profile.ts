'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * Get current user profile with company information
 */
export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('id, email, name, role, company_id, avatar')
      .eq('id', user.id)
      .maybeSingle()

    if (userError || !userProfile) {
      return { error: 'User profile not found' }
    }

    // Get company information if user has a company
    let company = null
    if (userProfile.company_id) {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id, name, domain, budget, logo, currency')
        .eq('id', userProfile.company_id)
        .maybeSingle()

      if (!companyError && companyData) {
        company = companyData
      }
    }

    return {
      user: userProfile,
      company,
    }
  } catch (error) {
    console.error('Get profile error:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch profile'
    }
  }
}

/**
 * Update user profile (name, email)
 * Users can update their own profile
 */
export async function updateUserProfile(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string

    if (!name || !email) {
      return { error: 'Name and email are required' }
    }

    // Update user profile
    const { error: updateError } = await supabase
      .from('users')
      .update({
        name: name.trim(),
        email: email.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      return { error: updateError.message }
    }

    // Update auth email if it changed
    const { data: currentUser } = await supabase.auth.getUser()
    if (currentUser?.user?.email !== email.trim()) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: email.trim(),
      })
      if (emailError) {
        console.warn('Failed to update auth email:', emailError)
        // Don't fail the whole operation if email update fails
      }
    }

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Update profile error:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update profile'
    }
  }
}

/**
 * Update company information
 * Only ADMIN and SUPER_ADMIN can update company details
 */
export async function updateCompanyInfo(formData: FormData) {
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
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role, company_id')
      .eq('id', user.id)
      .maybeSingle()

    if (userError || !currentUser) {
      return { error: 'User profile not found' }
    }

    // Check permissions - only ADMIN and SUPER_ADMIN can update company
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to update company information' }
    }

    if (!currentUser.company_id) {
      return { error: 'You are not associated with a company' }
    }

    const companyName = formData.get('companyName') as string
    const domain = formData.get('domain') as string
    const budget = formData.get('budget') as string
    const currency = formData.get('currency') as string

    const updates: {
      name?: string
      domain?: string | null
      budget?: number
      currency?: string
      updated_at: string
    } = {
      updated_at: new Date().toISOString(),
    }

    if (companyName) {
      updates.name = companyName.trim()
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

    if (currency && (currency === 'INR' || currency === 'USD')) {
      updates.currency = currency
    }

    const { error: updateError } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', currentUser.company_id)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Update company error:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update company information'
    }
  }
}
