'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * Update swag store settings
 */
export async function updateSwagStoreSettings(companyId: string, formData: FormData) {
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
      .select('role, company_id')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError || !currentUser) {
      return { error: 'User profile not found' }
    }

    // Check permissions - ADMIN and SUPER_ADMIN can update
    const { isCompanyHRDb } = await import('@/lib/roles')
    if (currentUser.role !== 'SUPER_ADMIN' && !isCompanyHRDb(currentUser.role)) {
      return { error: 'You do not have permission to update swag store settings' }
    }

    // ADMIN can only update their own company
    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.company_id !== companyId) {
      return { error: 'You can only update your own company\'s swag store settings' }
    }

    const subdomain = formData.get('subdomain') as string
    const isEnabled = formData.get('isEnabled') === 'true'

    // Validate subdomain format
    if (subdomain && !/^[a-z0-9-]+$/.test(subdomain)) {
      return { error: 'Subdomain can only contain lowercase letters, numbers, and hyphens' }
    }

    // Check if subdomain is already taken
    if (subdomain) {
      const { data: existing } = await supabase
        .from('companies')
        .select('id')
        .eq('subdomain', subdomain)
        .neq('id', companyId)
        .maybeSingle()

      if (existing) {
        return { error: 'This subdomain is already taken' }
      }
    }

    // Update company settings
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (subdomain !== undefined) {
      updates.subdomain = subdomain.trim() || null
    }

    // Store enabled status in settings JSONB
    const { data: company } = await supabase
      .from('companies')
      .select('settings')
      .eq('id', companyId)
      .single()

    const settings = company?.settings || {}
    settings.swagStoreEnabled = isEnabled

    updates.settings = settings

    const { error: updateError } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', companyId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Get swag store by identifier (public)
 */
export async function getSwagStoreByIdentifier(identifier: string) {
  try {
    const supabase = await createClient()
    
    const { data: company, error } = await supabase
      .from('companies')
      .select('id, name, logo, store_identifier, subdomain, settings')
      .eq('store_identifier', identifier)
      .single()

    if (error || !company) {
      return { data: null, error: 'Store not found' }
    }

    const settings = company?.settings || {}
    const isEnabled = settings.swagStoreEnabled || false

    // Get products for this company
    const { data: products } = await supabase
      .from('products')
      .select('id, name, description, image, price, currency, category')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })

    return {
      data: {
        companyName: company.name,
        companyLogo: company.logo,
        products: products || [],
        isEnabled,
      },
      error: null
    }
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Get swag store settings
 */
export async function getSwagStoreSettings(companyId: string) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    const { data: company, error } = await supabase
      .from('companies')
      .select('store_identifier, subdomain, settings')
      .eq('id', companyId)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    const settings = company?.settings || {}
    const isEnabled = settings.swagStoreEnabled || false

    return {
      data: {
        storeIdentifier: company?.store_identifier || null,
        subdomain: company?.subdomain || null,
        isEnabled,
      },
      error: null
    }
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
