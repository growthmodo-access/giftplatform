'use server'

import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Create user profile after signup
 * Uses service role key to bypass RLS if available, otherwise uses regular client
 */
export async function createUserProfile(
  userId: string, 
  email: string, 
  name?: string,
  companyData?: {
    name: string
    domain?: string
    taxId?: string
    currency?: string
    billingAddress?: {
      street: string
      city: string
      state?: string
      country: string
      zip_code: string
    }
  } | null
) {
  // Try using service role key first (bypasses RLS)
  // If not available, use regular client (should work if user session is established)
  const supabaseUrl = env.supabase.url
  const supabaseKey = env.supabase.serviceRoleKey || env.supabase.anonKey
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  
  let companyId: string | null = null

  // Create company if company data is provided
  if (companyData && companyData.name) {
    const storeIdentifier = companyData.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36)
    
    const { data: newCompany, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyData.name.trim(),
        domain: companyData.domain?.trim() || null,
        tax_id: companyData.taxId?.trim() || null,
        currency: companyData.currency || 'USD',
        billing_address: companyData.billingAddress || null,
        store_identifier: storeIdentifier,
      })
      .select()
      .single()

    if (companyError) {
      return { error: `Failed to create company: ${companyError.message}` }
    }

    companyId = newCompany.id
  }
  
  const { error } = await supabase
    .from('users')
    .upsert(
      {
        id: userId,
        email,
        name: name || null,
        role: companyId ? 'ADMIN' : 'EMPLOYEE', // If creating company, user becomes ADMIN
        company_id: companyId,
      },
      { onConflict: 'id' }
    )

  if (error) {
    // If user creation fails and we created a company, we should clean it up
    if (companyId) {
      await supabase.from('companies').delete().eq('id', companyId)
    }
    return { error: error.message }
  }

  return { success: true, companyId }
}
