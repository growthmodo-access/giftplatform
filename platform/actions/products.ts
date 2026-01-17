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

    // Get user's company
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (userError) {
      return { error: 'Failed to fetch user data' }
    }

    // Validate required fields
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const sku = formData.get('sku') as string
    const type = formData.get('type') as string

    if (!name || !price || !sku || !type) {
      return { error: 'Missing required fields: name, price, sku, and type are required' }
    }

    const product = {
      name: name.trim(),
      description: (formData.get('description') as string)?.trim() || null,
      category: (formData.get('category') as string)?.trim() || null,
      price: parseFloat(price),
      sku: sku.trim(),
      type: type as 'SWAG' | 'GIFT_CARD' | 'PHYSICAL_GIFT' | 'EXPERIENCE',
      company_id: userData?.company_id || null,
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

    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

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
    const { data: userData } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    // Check if user owns the product (same company) or is admin
    if (
      existingProduct.company_id &&
      userData?.company_id !== existingProduct.company_id &&
      userData?.role !== 'ADMIN'
    ) {
      return { error: 'You do not have permission to update this product' }
    }

    const price = formData.get('price') as string
    const stock = formData.get('stock') as string

    const updates: {
      name?: string
      description?: string | null
      category?: string | null
      price?: number
      stock?: number
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

    if (price) {
      const parsedPrice = parseFloat(price)
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return { error: 'Invalid price value' }
      }
      updates.price = parsedPrice
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
    const { data: userData } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    // Check if user owns the product (same company) or is admin
    if (
      existingProduct.company_id &&
      userData?.company_id !== existingProduct.company_id &&
      userData?.role !== 'ADMIN'
    ) {
      return { error: 'You do not have permission to delete this product' }
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

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
