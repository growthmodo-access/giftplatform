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

    const isEnabled = formData.get('isEnabled') === 'true'

    // Update company settings
    const updates: any = {
      updated_at: new Date().toISOString(),
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
      .select('id, name, logo, store_identifier, settings')
      .eq('store_identifier', identifier)
      .single()

    if (error || !company) {
      return { data: null, error: 'Store not found' }
    }

    const settings = company?.settings || {}
    const isEnabled = settings.swagStoreEnabled || false

    // Get products: company-specific + global (company_id null) so store always has catalog
    const { data: companyProducts } = await supabase
      .from('products')
      .select('id, name, description, image, price, currency, category, stock, requires_sizes, sizes')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })
    const { data: globalProducts } = await supabase
      .from('products')
      .select('id, name, description, image, price, currency, category, stock, requires_sizes, sizes')
      .is('company_id', null)
      .order('created_at', { ascending: false })
    const products = [...(companyProducts || []), ...(globalProducts || [])]

    return {
      data: {
        companyId: company.id,
        companyName: company.name,
        companyLogo: company.logo,
        companySettings: company.settings || {},
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
 * Create an order from the company store (cart checkout).
 * Caller must be authenticated; order is created for their company (store company).
 * Fulfillment: name, email, phone, address for order fulfillment.
 */
export async function createStoreOrder(
  companyId: string,
  items: { productId: string; quantity: number; price: number }[],
  fulfillment: { name: string; email: string; phone: string; address: string },
  currency: string = 'INR'
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Please sign in to place an order' }
    }
    const { data: currentUser } = await supabase.from('users').select('company_id, role').eq('id', user.id).maybeSingle()
    if (!currentUser) return { error: 'User profile not found' }
    if (!currentUser.company_id && currentUser.role !== 'SUPER_ADMIN') return { error: 'You must be part of a company to order from the store' }
    if (currentUser.company_id !== companyId && currentUser.role !== 'SUPER_ADMIN') return { error: 'You can only order from your company store' }
    if (!items.length) return { error: 'Cart is empty' }
    if (!fulfillment?.name?.trim()) return { error: 'Recipient name is required' }
    if (!fulfillment?.email?.trim()) return { error: 'Email is required' }
    if (!fulfillment?.phone?.trim()) return { error: 'Phone number is required' }
    if (!fulfillment?.address?.trim()) return { error: 'Shipping address is required' }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        company_id: companyId,
        status: 'PENDING',
        total,
        currency: currency || 'INR',
        shipping_address: fulfillment.address.trim(),
        recipient_name: fulfillment.name.trim(),
        recipient_email: fulfillment.email.trim(),
        recipient_phone: fulfillment.phone.trim(),
      })
      .select()
      .single()
    if (orderError) return { error: orderError.message }
    for (const item of items) {
      const { error: itemError } = await supabase.from('order_items').insert({
        order_id: newOrder.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })
      if (itemError) return { error: itemError.message }
    }
    return { success: true, orderId: newOrder.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to place order' }
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
      .select('store_identifier, settings')
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
