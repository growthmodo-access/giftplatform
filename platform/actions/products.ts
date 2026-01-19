'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get user's company and role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (userError || !userData) {
      return { error: 'Failed to fetch user data' }
    }

    // SUPER_ADMIN can create products without company_id (will need company_id in form)
    // Other roles need company_id
    if (userData?.role !== 'SUPER_ADMIN' && !userData?.company_id) {
      return { error: 'You must be part of a company to create products' }
    }

    // Validate required fields
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const sku = formData.get('sku') as string
    const type = formData.get('type') as string

    if (!name || !price || !sku || !type) {
      return { error: 'Missing required fields: name, price, sku, and type are required' }
    }

    // Handle company_id - SUPER_ADMIN can select any company, others use their own
    let company_id: string | null = null
    if (userData?.role === 'SUPER_ADMIN') {
      const formCompanyId = formData.get('company_id') as string
      company_id = formCompanyId && formCompanyId.trim() !== '' ? formCompanyId.trim() : null
    } else {
      company_id = userData?.company_id || null
    }

    const currency = (formData.get('currency') as string)?.trim() || 'USD'

    const product = {
      name: name.trim(),
      description: (formData.get('description') as string)?.trim() || null,
      category: (formData.get('category') as string)?.trim() || null,
      price: parseFloat(price),
      currency: currency,
      sku: sku.trim(),
      type: type as 'SWAG' | 'GIFT_CARD' | 'PHYSICAL_GIFT' | 'EXPERIENCE',
      company_id: company_id,
      stock: parseInt(formData.get('stock') as string) || 0,
    }

    // Validate price
    if (isNaN(product.price) || product.price < 0) {
      return { error: 'Invalid price value' }
    }

    // Validate stock
    if (isNaN(product.stock) || product.stock < 0) {
      return { error: 'Invalid stock value' }
    }

    // Validate type
    const validTypes = ['SWAG', 'GIFT_CARD', 'PHYSICAL_GIFT', 'EXPERIENCE']
    if (!validTypes.includes(product.type)) {
      return { error: 'Invalid product type' }
    }

    // Check permissions - only ADMIN and SUPER_ADMIN can create products
    if (userData?.role !== 'ADMIN' && userData?.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to create products. Only Admins can create products.' }
    }

    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (!data && !error) {
      return { error: 'Failed to create product - no data returned' }
    }

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/products')
    return { success: true, data }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    if (!id) {
      return { error: 'Product ID is required' }
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Verify product exists and user has permission
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('company_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingProduct) {
      return { error: 'Product not found' }
    }

    // Get user's company to verify ownership
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (userError || !userData) {
      return { error: 'Failed to fetch user data' }
    }

    // Check permissions - only ADMIN and SUPER_ADMIN can update products
    if (userData.role !== 'ADMIN' && userData.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to update products. Only Admins can update products.' }
    }

    // Check if user owns the product (same company) or is super admin
    if (
      existingProduct.company_id &&
      userData.company_id !== existingProduct.company_id &&
      userData.role !== 'SUPER_ADMIN'
    ) {
      return { error: 'You do not have permission to update this product' }
    }

    const price = formData.get('price') as string
    const stock = formData.get('stock') as string
    const currency = formData.get('currency') as string

    const updates: {
      name?: string
      description?: string | null
      category?: string | null
      price?: number
      currency?: string
      stock?: number
      company_id?: string | null
      updated_at: string
    } = {
      updated_at: new Date().toISOString(),
    }

    const name = formData.get('name') as string
    if (name) updates.name = name.trim()

    const description = formData.get('description') as string
    if (description !== null) {
      updates.description = description.trim() || null
    }

    const category = formData.get('category') as string
    if (category !== null) {
      updates.category = category.trim() || null
    }

    if (currency) {
      updates.currency = currency.trim()
    }

    if (price) {
      const parsedPrice = parseFloat(price)
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return { error: 'Invalid price value' }
      }
      updates.price = parsedPrice
    }

    // SUPER_ADMIN can update company_id
    if (userData.role === 'SUPER_ADMIN') {
      const formCompanyId = formData.get('company_id') as string
      updates.company_id = formCompanyId && formCompanyId.trim() !== '' ? formCompanyId.trim() : null
    }

    if (stock !== null) {
      const parsedStock = parseInt(stock)
      if (isNaN(parsedStock) || parsedStock < 0) {
        return { error: 'Invalid stock value' }
      }
      updates.stock = parsedStock
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    return { success: true, data }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function deleteProduct(id: string) {
  try {
    if (!id) {
      return { error: 'Product ID is required' }
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Verify product exists and user has permission
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('company_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingProduct) {
      return { error: 'Product not found' }
    }

    // Get user's company to verify ownership
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (userError || !userData) {
      return { error: 'Failed to fetch user data' }
    }

    // Check permissions - only ADMIN and SUPER_ADMIN can delete products
    if (userData.role !== 'ADMIN' && userData.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to delete products. Only Admins can delete products.' }
    }

    // Check if user owns the product (same company) or is super admin
    if (
      existingProduct.company_id &&
      userData.company_id !== existingProduct.company_id &&
      userData.role !== 'SUPER_ADMIN'
    ) {
      return { error: 'You do not have permission to delete this product' }
    }

    const { error } = await supabase
      .from('products')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null) // Only soft delete if not already deleted

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/products')
    return { success: true }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
