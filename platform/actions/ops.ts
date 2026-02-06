'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Ops dashboard summary (SUPER_ADMIN only): campaign count, order count, vendor count.
 */
export async function getOpsSummary() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { campaignsCount: 0, ordersCount: 0, vendorsCount: 0, error: 'Forbidden' }
    }

    const [
      { count: campaignsCount },
      { data: orderRecipients },
      { count: vendorsCount },
    ] = await Promise.all([
      supabase.from('campaigns').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('id').not('campaign_recipient_id', 'is', null),
      supabase.from('vendors').select('*', { count: 'exact', head: true }),
    ])

    return {
      campaignsCount: campaignsCount ?? 0,
      ordersCount: orderRecipients?.length ?? 0,
      vendorsCount: vendorsCount ?? 0,
      error: null,
    }
  } catch (e) {
    return { campaignsCount: 0, ordersCount: 0, vendorsCount: 0, error: e instanceof Error ? e.message : 'Failed to load summary' }
  }
}

/**
 * List campaigns for Ops view (SUPER_ADMIN only) with recipient and order counts and company name.
 */
export async function getOpsCampaigns() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { data: [], error: 'Forbidden' }
    }

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('id, name, company_id, status, created_at')
      .order('created_at', { ascending: false })

    if (error) return { data: [], error: error.message }
    if (!campaigns?.length) return { data: [], error: null }

    const companyIds = [...new Set((campaigns ?? []).map((c) => c.company_id).filter(Boolean))] as string[]
    const { data: companies } = companyIds.length
      ? await supabase.from('companies').select('id, name').in('id', companyIds)
      : { data: [] }
    const companyMap = new Map((companies ?? []).map((co) => [co.id, co.name]))

    const campaignIds = campaigns.map((c) => c.id)
    const { data: recipientCounts } = await supabase
      .from('campaign_recipients')
      .select('campaign_id')
    const countByCampaign = (recipientCounts ?? []).reduce(
      (acc, r) => {
        acc[r.campaign_id] = (acc[r.campaign_id] ?? 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const { data: orders } = await supabase
      .from('orders')
      .select('campaign_recipient_id')
      .not('campaign_recipient_id', 'is', null)
    const recipientIdsWithOrders = new Set((orders ?? []).map((o) => o.campaign_recipient_id))
    const { data: recs } = await supabase
      .from('campaign_recipients')
      .select('id, campaign_id')
      .in('id', Array.from(recipientIdsWithOrders))
    const orderCountByCampaign = (recs ?? []).reduce(
      (acc, r) => {
        acc[r.campaign_id] = (acc[r.campaign_id] ?? 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const data = campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      company_id: c.company_id,
      company_name: (c.company_id && companyMap.get(c.company_id)) ?? null,
      status: c.status,
      created_at: c.created_at,
      recipient_count: countByCampaign[c.id] ?? 0,
      order_count: orderCountByCampaign[c.id] ?? 0,
    }))
    return { data, error: null }
  } catch (e) {
    return { data: [], error: e instanceof Error ? e.message : 'Failed to load campaigns' }
  }
}

/**
 * Get orders for a campaign (via campaign_recipients) with vendor assignments. SUPER_ADMIN only.
 */
export async function getCampaignOrdersWithVendors(campaignId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { data: [], campaign: null, error: 'Forbidden' }
    }

    const { data: campaign, error: campError } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('id', campaignId)
      .single()
    if (campError || !campaign) return { data: [], campaign: null, error: 'Campaign not found' }

    const { data: recipients } = await supabase
      .from('campaign_recipients')
      .select('id, name, email, order_id')
      .eq('campaign_id', campaignId)
    const orderIds = [...new Set((recipients ?? []).map((r) => r.order_id).filter(Boolean))] as string[]
    if (orderIds.length === 0) {
      return { data: [], campaign: { id: campaign.id, name: campaign.name }, error: null }
    }

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_number, status, total, currency, campaign_recipient_id')
      .in('id', orderIds)
    if (ordersError) return { data: [], campaign: null, error: ordersError.message }

    const { data: assignments } = await supabase
      .from('order_vendor_assignments')
      .select('id, order_id, vendor_id, status, cost, tracking_number')
      .in('order_id', orderIds)
    const { data: vendors } = await supabase
      .from('vendors')
      .select('id, name')
      .in('id', [...new Set((assignments ?? []).map((a) => a.vendor_id))])

    const recipientByOrder = new Map((recipients ?? []).filter((r) => r.order_id).map((r) => [r.order_id, r]))
    const vendorMap = new Map((vendors ?? []).map((v) => [v.id, v.name]))
    const assignmentsByOrder = (assignments ?? []).reduce(
      (acc, a) => {
        if (!acc[a.order_id]) acc[a.order_id] = []
        acc[a.order_id].push({
          id: a.id,
          vendor_id: a.vendor_id,
          vendor_name: vendorMap.get(a.vendor_id) ?? '—',
          status: a.status,
          cost: a.cost,
          tracking_number: a.tracking_number,
        })
        return acc
      },
      {} as Record<string, { id: string; vendor_id: string; vendor_name: string; status: string; cost: number | null; tracking_number: string | null }[]>
    )

    const data = (orders ?? []).map((o) => {
      const rec = recipientByOrder.get(o.id)
      return {
        id: o.id,
        order_number: o.order_number,
        status: o.status,
        total: o.total,
        currency: o.currency,
        recipient_name: rec?.name ?? null,
        recipient_email: rec?.email ?? null,
        vendor_assignments: assignmentsByOrder[o.id] ?? [],
      }
    })

    return { data, campaign: { id: campaign.id, name: campaign.name }, error: null }
  } catch (e) {
    return {
      data: [],
      campaign: null,
      error: e instanceof Error ? e.message : 'Failed to load orders',
    }
  }
}
