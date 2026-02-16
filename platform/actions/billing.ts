'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getInvoices() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('role, company_id')
      .eq('id', user.id)
      .maybeSingle()

    if (!currentUser) {
      return { data: [], error: 'User profile not found' }
    }

    let query = supabase
      .from('invoices')
      .select(`
        *,
        companies:company_id (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.company_id) {
      query = query.eq('company_id', currentUser.company_id)
    }

    const { data: invoices, error } = await query

    if (error) {
      return { data: [], error: error.message }
    }

    const formattedInvoices = invoices?.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoice_number,
      orderId: inv.order_id,
      companyName: (inv.companies as any)?.name || 'N/A',
      amount: `${inv.currency || 'USD'} ${Number(inv.total_amount).toFixed(2)}`,
      status: inv.status,
      dueDate: inv.due_date,
      createdAt: inv.created_at,
    })) || []

    return { data: formattedInvoices, error: null }
  } catch (error) {
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function getWalletBalance() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('balance, currency')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      return { data: null, error: error.message }
    }

    // Create wallet if it doesn't exist (use company currency, default INR)
    if (!wallet) {
      let currency = 'INR'
      const { data: userRow } = await supabase.from('users').select('company_id').eq('id', user.id).maybeSingle()
      if (userRow?.company_id) {
        const { data: company } = await supabase.from('companies').select('currency').eq('id', userRow.company_id).maybeSingle()
        if (company?.currency) currency = company.currency
      }
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert({
          user_id: user.id,
          balance: 0,
          currency,
        })
        .select()
        .single()

      if (createError) {
        return { data: null, error: createError.message }
      }

      return { 
        data: { balance: Number(newWallet.balance), currency: newWallet.currency }, 
        error: null 
      }
    }

    // Sync existing wallet currency to company currency (e.g. HR company is INR)
    const { data: userRow } = await supabase.from('users').select('company_id').eq('id', user.id).maybeSingle()
    if (userRow?.company_id) {
      const { data: company } = await supabase.from('companies').select('currency').eq('id', userRow.company_id).maybeSingle()
      if (company?.currency && company.currency !== wallet.currency) {
        await supabase.from('wallets').update({ currency: company.currency }).eq('user_id', user.id)
        return { data: { balance: Number(wallet.balance), currency: company.currency }, error: null }
      }
    }

    return { 
      data: { balance: Number(wallet.balance), currency: wallet.currency }, 
      error: null 
    }
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function addFundsToWallet(amount: number, paymentMethod: 'stripe' | 'razorpay' | 'bank_transfer', paymentReference?: string) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    if (amount <= 0) {
      return { error: 'Amount must be greater than 0' }
    }

    // Get or create wallet
    let { data: wallet } = await supabase
      .from('wallets')
      .select('id, balance, currency')
      .eq('user_id', user.id)
      .single()

    if (!wallet) {
      let currency = 'INR'
      const { data: userRow } = await supabase.from('users').select('company_id').eq('id', user.id).maybeSingle()
      if (userRow?.company_id) {
        const { data: company } = await supabase.from('companies').select('currency').eq('id', userRow.company_id).maybeSingle()
        if (company?.currency) currency = company.currency
      }
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert({
          user_id: user.id,
          balance: 0,
          currency,
        })
        .select()
        .single()

      if (createError) {
        return { error: createError.message }
      }
      wallet = newWallet
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: wallet.id,
        type: 'CREDIT',
        amount: amount,
        description: `Funds added via ${paymentMethod}`,
        reference_id: paymentReference || null,
        payment_method: paymentMethod,
        status: paymentMethod === 'bank_transfer' ? 'PENDING' : 'COMPLETED',
      })

    if (transactionError) {
      return { error: transactionError.message }
    }

    // Update wallet balance (only if payment is completed)
    if (paymentMethod !== 'bank_transfer') {
      const { error: updateError } = await supabase
        .from('wallets')
        .update({
          balance: Number(wallet.balance) + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id)

      if (updateError) {
        return { error: updateError.message }
      }
    }

    revalidatePath('/billing')
    return { success: true }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function generateInvoiceForOrder(orderId: string) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        companies:company_id (
          id,
          name,
          billing_address,
          tax_id
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return { error: 'Order not found' }
    }

    // Check if invoice already exists
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('id')
      .eq('order_id', orderId)
      .single()

    if (existingInvoice) {
      return { error: 'Invoice already exists for this order' }
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate tax (simplified - 10% for now)
    const taxRate = 0.10
    const taxAmount = Number(order.total) * taxRate
    const totalAmount = Number(order.total) + taxAmount

    // Get order items
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('*, products:product_id (name, price)')
      .eq('order_id', orderId)

    const items = orderItems?.map(item => ({
      name: (item.products as any)?.name || 'Product',
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    })) || []

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        order_id: orderId,
        company_id: order.company_id,
        user_id: order.user_id,
        amount: order.total,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        currency: order.currency || 'USD',
        status: 'PENDING',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        billing_address: (order.companies as any)?.billing_address || null,
        items: items,
      })
      .select()
      .single()

    if (invoiceError) {
      return { error: invoiceError.message }
    }

    revalidatePath('/billing')
    return { success: true, data: invoice }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
