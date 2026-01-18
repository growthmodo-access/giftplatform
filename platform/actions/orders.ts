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
      .select('id, order_number, user_id, status, total, currency, shipping_address, tracking_number, created_at, company_id')

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

    // Get user IDs and product IDs
    const userIds = [...new Set(orders.map(o => o.user_id))]
    const orderIds = orders.map(o => o.id)

    // Fetch users
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', userIds)

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
      
      // Map payment methods to display names
      const paymentMethodMap: Record<string, string> = {
        'credit_card': 'Credit Card',
        'bank_transfer': 'Bank Transfer',
        'crypto': 'Crypto',
        'paypal': 'PayPal',
      }
      
      return {
        id: order.id,
        orderNumber: order.order_number,
        employee: user?.name || user?.email || 'Unknown',
        employeeEmail: user?.email,
        product: product?.name || (items.length > 1 ? 'Multiple items' : 'Unknown product'),
        amount: `${order.currency || 'USD'} ${Number(order.total).toFixed(2)}`,
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        dateTimestamp: order.created_at, // Keep original timestamp for filtering
        mobile: payment?.phone_number || user?.email?.split('@')[0] || undefined,
        paymentMethod: payment?.payment_method ? paymentMethodMap[payment.payment_method] || payment.payment_method : undefined,
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

    // Get current user's company
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (userError || !currentUser) {
      return { error: 'Failed to fetch user data' }
    }

    // SUPER_ADMIN can create orders without company_id requirement
    // Other roles need company_id
    if (currentUser.role !== 'SUPER_ADMIN' && !currentUser.company_id) {
      return { error: 'You must be part of a company to create orders' }
    }

    // Check permissions - only ADMIN, MANAGER, and SUPER_ADMIN can create orders
    // HR cannot create orders (read-only access)
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to create orders. Only Admins and Managers can create orders.' }
    }

    // Get form data
    const employeeId = formData.get('employee_id') as string
    const productId = formData.get('product_id') as string
    const quantity = parseInt(formData.get('quantity') as string) || 1
    const shippingAddress = formData.get('shipping_address') as string

    if (!employeeId || !productId) {
      return { error: 'Employee and product are required' }
    }

    // Verify employee exists
    const { data: employee, error: employeeError } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', employeeId)
      .single()

    if (employeeError || !employee) {
      return { error: 'Employee not found' }
    }

    // SUPER_ADMIN can create orders for any employee
    // Other roles can only create orders for employees in their company
    if (currentUser.role !== 'SUPER_ADMIN' && employee.company_id !== currentUser.company_id) {
      return { error: 'Employee not found or not in your company' }
    }

    // Use employee's company_id or current user's company_id
    const orderCompanyId = currentUser.role === 'SUPER_ADMIN' ? employee.company_id : currentUser.company_id

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, price, stock, name')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return { error: 'Product not found' }
    }

    // Check stock availability
    if (product.stock < quantity) {
      return { error: `Insufficient stock. Only ${product.stock} available.` }
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Calculate total
    const total = product.price * quantity

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: employeeId,
        company_id: orderCompanyId,
        status: 'PENDING',
        total: total,
        currency: 'USD',
        shipping_address: shippingAddress || null,
      })
      .select()
      .single()

    if (orderError || !order) {
      return { error: `Failed to create order: ${orderError?.message || 'Unknown error'}` }
    }

    // Create order item
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: productId,
        quantity: quantity,
        price: product.price,
      })

    if (itemError) {
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id)
      return { error: `Failed to create order item: ${itemError.message}` }
    }

    // Update product stock
    const { error: stockError } = await supabase
      .from('products')
      .update({ stock: product.stock - quantity })
      .eq('id', productId)

    if (stockError) {
      console.error('Failed to update product stock:', stockError)
      // Don't fail the order creation, but log the error
    }

    revalidatePath('/orders')
    return { 
      success: true, 
      message: `Order ${orderNumber} created successfully`,
      orderId: order.id
    }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
