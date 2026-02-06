'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { env } from '@/lib/env'
import type { Database } from '@/types/database'
import type { CsvRecipientRow } from '@/lib/parse-recipients-csv'

const TOKEN_BYTES = 24

function generateGiftLinkToken(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(TOKEN_BYTES)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
  }
  return Array.from({ length: TOKEN_BYTES * 2 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

/**
 * Create campaign_recipients from CSV rows for a campaign. Caller must be HR/Admin of campaign's company.
 */
export async function createRecipientsFromCsv(
  campaignId: string,
  rows: CsvRecipientRow[],
  linkExpiresAt: Date | null
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect('/login')
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!currentUser?.company_id && currentUser?.role !== 'SUPER_ADMIN') {
      return { error: 'You must be part of a company' }
    }
    if (!['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER'].includes(currentUser?.role ?? '')) {
      return { error: 'You do not have permission to manage campaign recipients' }
    }

    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, company_id')
      .eq('id', campaignId)
      .single()

    if (!campaign) {
      return { error: 'Campaign not found' }
    }
    if (currentUser.role !== 'SUPER_ADMIN' && campaign.company_id !== currentUser.company_id) {
      return { error: 'Campaign not found' }
    }

    const inserts: Database['public']['Tables']['campaign_recipients']['Insert'][] = rows.map(row => ({
      campaign_id: campaignId,
      name: row.name,
      email: row.email,
      designation: row.designation ?? null,
      department: row.department ?? null,
      phone: row.phone ?? null,
      gift_link_token: generateGiftLinkToken(),
      link_expires_at: linkExpiresAt?.toISOString() ?? null,
    }))

    const { data, error } = await supabase
      .from('campaign_recipients')
      .insert(inserts)
      .select('id, email, gift_link_token')

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/campaigns')
    return { success: true, data, count: data?.length ?? 0 }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Failed to create recipients',
    }
  }
}

/**
 * List campaign_recipients for a campaign. Caller must be HR/Admin of campaign's company.
 */
export async function listRecipientsByCampaign(campaignId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect('/login')
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!currentUser) {
      return { data: [], error: 'User not found' }
    }

    let query = supabase
      .from('campaign_recipients')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: true })

    if (currentUser.role !== 'SUPER_ADMIN') {
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('id')
        .eq('id', campaignId)
        .eq('company_id', currentUser.company_id)
        .single()
      if (!campaign) {
        return { data: [], error: 'Campaign not found' }
      }
    }

    const { data, error } = await query
    if (error) {
      return { data: [], error: error.message }
    }
    return { data: data ?? [] }
  } catch (e) {
    return {
      data: [],
      error: e instanceof Error ? e.message : 'Failed to list recipients',
    }
  }
}

/**
 * Get recipient by gift link token. Uses service role so public gift page can call without auth.
 */
export async function getRecipientByToken(token: string) {
  try {
    const { createClient: createSupabase } = await import('@supabase/supabase-js')
    const key = env.supabase.serviceRoleKey || env.supabase.anonKey
    const supabase = createSupabase(env.supabase.url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data, error } = await supabase
      .from('campaign_recipients')
      .select(`
        id,
        campaign_id,
        name,
        email,
        gift_link_token,
        link_expires_at,
        gift_selected_at,
        order_id,
        selected_product_id,
        shipping_address,
        size_color_preference
      `)
      .eq('gift_link_token', token)
      .single()

    if (error || !data) {
      return { data: null, error: 'Invalid or expired link' }
    }

    if (data.gift_selected_at) {
      return { data: null, error: 'This gift has already been claimed' }
    }

    const now = new Date().toISOString()
    if (data.link_expires_at && data.link_expires_at < now) {
      return { data: null, error: 'This link has expired' }
    }

    return { data, error: null }
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Invalid or expired link',
    }
  }
}

/**
 * Get campaign + products for public gift page (by token). Uses service role.
 */
export async function getCampaignAndProductsForToken(token: string) {
  const recipientResult = await getRecipientByToken(token)
  if (recipientResult.error || !recipientResult.data) {
    return { data: null, error: recipientResult.error ?? 'Invalid link' }
  }
  const recipient = recipientResult.data

  try {
    const { createClient: createSupabase } = await import('@supabase/supabase-js')
    const key = env.supabase.serviceRoleKey || env.supabase.anonKey
    const supabase = createSupabase(env.supabase.url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data: campaign, error: campError } = await supabase
      .from('campaigns')
      .select('id, name, company_id, selected_products, per_recipient_budget')
      .eq('id', recipient.campaign_id)
      .single()

    if (campError || !campaign) {
      return { data: null, error: 'Campaign not found' }
    }

    const productIds = (campaign.selected_products as string[] | null) || []
    if (productIds.length === 0) {
      return { data: null, error: 'No products available for this campaign' }
    }

    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, description, image, price, currency')
      .in('id', productIds)

    if (prodError || !products?.length) {
      return { data: { recipient, campaign, products: [] }, error: null }
    }

    const budget = (campaign.per_recipient_budget as number | null) ?? null
    const withinBudget = budget != null
      ? products.filter(p => p.price <= budget)
      : products

    return {
      data: {
        recipient,
        campaign: { id: campaign.id, name: campaign.name, per_recipient_budget: budget },
        products: withinBudget,
      },
      error: null,
    }
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Failed to load campaign',
    }
  }
}

export type SubmitGiftSelectionInput = {
  productId: string
  shippingAddress: Record<string, unknown> | string
  sizeColorPreference?: Record<string, unknown> | null
}

/**
 * Submit gift selection (public page). Uses service role. Creates order and updates recipient.
 */
export async function submitGiftSelection(token: string, input: SubmitGiftSelectionInput) {
  const recipientResult = await getRecipientByToken(token)
  if (recipientResult.error || !recipientResult.data) {
    return { error: recipientResult.error ?? 'Invalid or expired link' }
  }
  const recipient = recipientResult.data

  try {
    const { createClient: createSupabase } = await import('@supabase/supabase-js')
    const key = env.supabase.serviceRoleKey || env.supabase.anonKey
    const supabase = createSupabase(env.supabase.url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data: campaign, error: campError } = await supabase
      .from('campaigns')
      .select('id, company_id, selected_products, per_recipient_budget')
      .eq('id', recipient.campaign_id)
      .single()

    if (campError || !campaign) {
      return { error: 'Campaign not found' }
    }

    const productIds = (campaign.selected_products as string[] | null) || []
    if (!productIds.includes(input.productId)) {
      return { error: 'Selected product is not available for this campaign' }
    }

    const { data: product, error: prodError } = await supabase
      .from('products')
      .select('id, name, price, currency')
      .eq('id', input.productId)
      .single()

    if (prodError || !product) {
      return { error: 'Product not found' }
    }

    const budget = (campaign.per_recipient_budget as number | null) ?? null
    if (budget != null && product.price > budget) {
      return { error: 'Selected product exceeds your gift budget' }
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`
    const shippingAddress =
      typeof input.shippingAddress === 'string'
        ? input.shippingAddress
        : JSON.stringify(input.shippingAddress)

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: null,
        company_id: campaign.company_id,
        campaign_recipient_id: recipient.id,
        status: 'PENDING',
        total: product.price,
        currency: product.currency ?? 'USD',
        shipping_address: shippingAddress,
      })
      .select()
      .single()

    if (orderError) {
      return { error: orderError.message }
    }

    const { error: itemError } = await supabase.from('order_items').insert({
      order_id: newOrder.id,
      product_id: input.productId,
      quantity: 1,
      price: product.price,
    })

    if (itemError) {
      await supabase.from('orders').delete().eq('id', newOrder.id)
      return { error: 'Failed to create order' }
    }

    const { error: updateError } = await supabase
      .from('campaign_recipients')
      .update({
        order_id: newOrder.id,
        selected_product_id: input.productId,
        shipping_address: typeof input.shippingAddress === 'string' ? null : input.shippingAddress,
        size_color_preference: input.sizeColorPreference ?? null,
        gift_selected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', recipient.id)

    if (updateError) {
      await supabase.from('orders').delete().eq('id', newOrder.id)
      return { error: 'Failed to save selection' }
    }

    // Send confirmation email (non-blocking)
    const { sendGiftConfirmationEmail } = await import('@/lib/email-notifications')
    const productName = product.name ?? 'Your selected gift'
    sendGiftConfirmationEmail(
      recipient.email,
      recipient.name,
      newOrder.order_number,
      productName
    ).catch((err) => console.error('Gift confirmation email failed:', err))

    return {
      success: true,
      orderNumber: newOrder.order_number,
      orderId: newOrder.id,
      recipientEmail: recipient.email,
    }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Failed to submit gift selection',
    }
  }
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://goodies.so'

/**
 * Get "my gift" status for the current user (matched by email to campaign_recipients). For employee dashboard.
 */
export async function getMyGiftStatus() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user?.email) {
      return { data: [], error: null }
    }

    const { data: rows, error } = await supabase
      .from('campaign_recipients')
      .select(`
        id,
        campaign_id,
        name,
        email,
        gift_link_token,
        link_expires_at,
        gift_selected_at,
        order_id,
        selected_product_id,
        created_at
      `)
      .eq('email', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      return { data: [], error: error.message }
    }
    if (!rows?.length) {
      return { data: [], error: null }
    }

    const campaignIds = [...new Set(rows.map((r) => r.campaign_id))]
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, name')
      .in('id', campaignIds)

    const productIds = [...new Set(rows.map((r) => r.selected_product_id).filter(Boolean))] as string[]
    const { data: products } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds)

    const orderIds = [...new Set(rows.map((r) => r.order_id).filter(Boolean))] as string[]
    const { data: orders } = orderIds.length
      ? await supabase.from('orders').select('id, order_number, status').in('id', orderIds)
      : { data: [] }

    const campaignMap = new Map((campaigns ?? []).map((c) => [c.id, c.name]))
    const productMap = new Map((products ?? []).map((p) => [p.id, p.name]))
    const orderMap = new Map((orders ?? []).map((o) => [o.id, { order_number: o.order_number, status: o.status }]))

    const data = rows.map((r) => {
      const order = r.order_id ? orderMap.get(r.order_id) : null
      let status: string
      if (r.gift_selected_at && order) {
        status = order.status
      } else if (r.link_expires_at && new Date(r.link_expires_at) < new Date()) {
        status = 'Expired'
      } else {
        status = 'Pending'
      }
      return {
        id: r.id,
        campaignName: campaignMap.get(r.campaign_id) ?? 'Campaign',
        productName: r.selected_product_id ? productMap.get(r.selected_product_id) ?? null : null,
        orderNumber: order?.order_number ?? null,
        status,
        giftLinkUrl: `${APP_URL}/g/${r.gift_link_token}`,
        linkExpiresAt: r.link_expires_at,
        selectedAt: r.gift_selected_at,
        createdAt: r.created_at,
      }
    })

    return { data, error: null }
  } catch (e) {
    return {
      data: [],
      error: e instanceof Error ? e.message : 'Failed to load gift status',
    }
  }
}

/**
 * Send gift link emails to all recipients of a campaign (CSV flow). Call after campaign is sent.
 */
export async function sendGiftLinkEmailsForCampaign(campaignId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect('/login')
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!currentUser || !['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER'].includes(currentUser.role ?? '')) {
      return { error: 'You do not have permission to send gift links' }
    }

    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, company_id, name, link_valid_until')
      .eq('id', campaignId)
      .single()

    if (!campaign) {
      return { error: 'Campaign not found' }
    }
    if (currentUser.role !== 'SUPER_ADMIN' && campaign.company_id !== currentUser.company_id) {
      return { error: 'Campaign not found' }
    }

    const { data: recipients, error: listError } = await supabase
      .from('campaign_recipients')
      .select('id, name, email, gift_link_token, link_expires_at')
      .eq('campaign_id', campaignId)

    if (listError || !recipients?.length) {
      return { error: listError?.message ?? 'No recipients found' }
    }

    const { sendGiftLinkEmail } = await import('@/lib/email-notifications')
    let sent = 0
    const errors: string[] = []
    for (const r of recipients) {
      const url = `${APP_URL}/g/${r.gift_link_token}`
      const expiresText = r.link_expires_at
        ? `This link expires on ${new Date(r.link_expires_at).toLocaleDateString()}.`
        : undefined
      const result = await sendGiftLinkEmail(
        r.email,
        r.name,
        campaign.name,
        url,
        expiresText
      )
      if (result.success) sent++
      else if (result.error) errors.push(`${r.email}: ${result.error}`)
    }

    revalidatePath('/campaigns')
    return {
      success: true,
      sent,
      total: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Failed to send gift link emails',
    }
  }
}

