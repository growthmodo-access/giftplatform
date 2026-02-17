'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getOrders() {
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

    // Get orders based on role
    let query = supabase
      .from('orders')
      .select('id, order_number, user_id, status, total, currency, shipping_address, tracking_number, created_at, company_id, recipient_name, recipient_email, recipient_phone')

    // SUPER_ADMIN can see all orders (all companies)
    if (currentUser.role === 'SUPER_ADMIN') {
      // No company filter for SUPER_ADMIN
    } else {
      // Other roles need company_id
      if (!currentUser.company_id) {
        return { data: [], error: null }
      }
      query = query.eq('company_id', currentUser.company_id)
    }

    // EMPLOYEE can only see their own orders
    if (currentUser.role === 'EMPLOYEE') {
      query = query.eq('user_id', user.id)
    }
    // MANAGER can see all orders (for now - could be filtered by team later)
    // ADMIN, HR see all company orders

    const { data: orders, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return { data: [], error: error.message }
    }

    if (!orders || orders.length === 0) {
      return { data: [], error: null }
    }

    // Get user IDs and product IDs (user_id can be null for campaign gift orders)
    const userIds = [...new Set(orders.map(o => o.user_id).filter((id): id is string => id != null))]
    const orderIds = orders.map(o => o.id)

    // Fetch users (only when we have user IDs)
    const { data: users } = userIds.length > 0
      ? await supabase.from('users').select('id, name, email').in('id', userIds)
      : { data: [] }

    // Get company IDs
    const companyIds = [...new Set(orders.map(o => o.company_id).filter(Boolean))]
    
    // Fetch companies
    const { data: companies } = companyIds.length > 0 ? await supabase
      .from('companies')
      .select('id, name')
      .in('id', companyIds) : { data: [] }

    // Create company lookup map
    const companyMap = new Map(companies?.map(c => [c.id, c.name]) || [])

    // Get order items for each order
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('order_id, product_id, quantity, price')
      .in('order_id', orderIds)

    // Get payment information if available (gracefully handle if table doesn't exist)
    let payments: any[] = []
    try {
      const { data: paymentData } = await supabase
        .from('payments')
        .select('order_id, payment_method, phone_number')
        .in('order_id', orderIds)
      payments = paymentData || []
    } catch (error) {
      // Payments table might not exist, continue without it
      console.log('Payments table not available')
    }

    // Get product IDs
    const productIds = [...new Set((orderItems || []).map(item => item.product_id))]
    
    // Fetch products
    const { data: products } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds)

    // Create lookup maps
    const userMap = new Map((users || []).map(u => [u.id, u]))
    const productMap = new Map((products || []).map(p => [p.id, p]))
    const paymentMap = new Map((payments || []).map(p => [p.order_id, p]))

    // Combine orders with items
    const ordersWithItems = orders.map(order => {
      const items = (orderItems || []).filter(item => item.order_id === order.id)
      const firstItem = items[0]
      const product = firstItem ? productMap.get(firstItem.product_id) : null
      const user = userMap.get(order.user_id)
      const payment = paymentMap.get(order.id)
      const companyName = order.company_id ? companyMap.get(order.company_id) : null
      
      // Map payment methods to display names
      const paymentMethodMap: Record<string, string> = {
        'credit_card': 'Credit Card',
        'bank_transfer': 'Bank Transfer',
        'crypto': 'Crypto',
        'paypal': 'PayPal',
      }
      
      const recipientName = (order as any).recipient_name
      const recipientEmail = (order as any).recipient_email
      const recipientPhone = (order as any).recipient_phone
      return {
        id: order.id,
        orderNumber: order.order_number,
        employee: recipientName || user?.name || user?.email || 'Unknown',
        employeeEmail: recipientEmail ?? user?.email,
        product: product?.name || (items.length > 1 ? 'Multiple items' : 'Unknown product'),
        amount: `${order.currency || 'INR'} ${Number(order.total).toFixed(2)}`,
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        dateTimestamp: order.created_at, // Keep original timestamp for filtering
        mobile: recipientPhone || payment?.phone_number || user?.email?.split('@')[0] || undefined,
        paymentMethod: payment?.payment_method ? paymentMethodMap[payment.payment_method] || payment.payment_method : undefined,
        company: companyName || 'N/A',
        companyId: order.company_id,
        shippingAddress: order.shipping_address || null,
        trackingNumber: order.tracking_number || null,
        currency: order.currency || 'INR',
      }
    })

    return { data: ordersWithItems, error: null }
  } catch (error) {
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Update order tracking number and status
 */
export async function updateOrderTracking(orderId: string, updates: { trackingNumber?: string | null, status?: string }) {
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

    const { isCompanyHRDb } = await import('@/lib/roles')
    if (currentUser.role !== 'SUPER_ADMIN' && !isCompanyHRDb(currentUser.role)) {
      return { error: 'You do not have permission to update orders' }
    }

    // Get order to check company
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('company_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return { error: 'Order not found' }
    }

    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.company_id !== order.company_id) {
      return { error: 'You can only update orders from your company' }
    }

    // Update order
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.trackingNumber !== undefined) {
      updateData.tracking_number = updates.trackingNumber
    }

    if (updates.status) {
      updateData.status = updates.status
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/orders')
    return { success: true }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function createOrder(formData: FormData) {
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
      return { error: 'You do not have permission to create orders' }
    }

    const employeeId = formData.get('employee_id') as string
    const productId = formData.get('product_id') as string
    const quantity = parseInt(formData.get('quantity') as string) || 1
    const shippingAddressRaw = formData.get('shipping_address') as string | null

    if (!employeeId || !productId) {
      return { error: 'Employee and product are required' }
    }

    if (!shippingAddressRaw || !String(shippingAddressRaw).trim()) {
      return { error: 'Shipping address is required. Please enter address, city, country, and postal code.' }
    }

    const shippingAddress = String(shippingAddressRaw).trim()

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, price, currency, company_id')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return { error: 'Product not found' }
    }

    // Get employee's company
    const { data: employee, error: employeeError } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', employeeId)
      .single()

    if (employeeError || !employee) {
      return { error: 'Employee not found' }
    }

    // Determine company_id - use product's company or employee's company
    const companyId = product.company_id || employee.company_id || currentUser.company_id

    // Calculate total
    const total = (product.price || 0) * quantity

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: employeeId,
        company_id: companyId,
        status: 'PENDING',
        total: total,
        currency: product.currency || 'INR',
        shipping_address: shippingAddress,
      })
      .select()
      .single()

    if (orderError) {
      return { error: orderError.message }
    }

    const { insertAuditLog } = await import('@/lib/audit')
    await insertAuditLog(user.id, 'order.create', 'order', newOrder.id, { order_number: newOrder.order_number })

    // Create order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert({
        order_id: newOrder.id,
        product_id: productId,
        quantity: quantity,
        price: product.price || 0,
      })

    if (itemsError) {
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', newOrder.id)
      return { error: itemsError.message }
    }

    revalidatePath('/orders')
    return { success: true, data: newOrder }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

/** Export orders as CSV (same scope as getOrders by role). */
export async function exportOrdersAsCsv(): Promise<{ csv: string; error?: string }> {
  try {
    const { data: orders, error } = await getOrders()
    if (error) return { csv: '', error }
    if (!orders?.length) {
      const header = 'Order Number,Employee,Email,Status,Amount,Currency,Date\n'
      return { csv: header }
    }
    const rows = orders.map((o) => {
      const emp = (o.employee ?? '').replace(/"/g, '""')
      const email = (o.employeeEmail ?? '').replace(/"/g, '""')
      const amount = (o.amount ?? '').replace(/"/g, '""')
      return `"${o.orderNumber}","${emp}","${email}","${o.status}","${amount}","${o.currency || 'INR'}","${o.date}"`
    })
    const header = 'Order Number,Employee,Email,Status,Amount,Currency,Date\n'
    return { csv: header + rows.join('\n') }
  } catch (e) {
    return { csv: '', error: e instanceof Error ? e.message : 'Export failed' }
  }
}
