'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getVendors() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { data: [], error: 'Forbidden' }
    }

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name')

    if (error) return { data: [], error: error.message }
    return { data: data ?? [], error: null }
  } catch (e) {
    return { data: [], error: e instanceof Error ? e.message : 'Failed to load vendors' }
  }
}

export async function createVendor(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { error: 'Forbidden' }
    }

    const name = (formData.get('name') as string)?.trim()
    const email = (formData.get('email') as string)?.trim()
    if (!name || !email) return { error: 'Name and email are required' }

    const { data, error } = await supabase
      .from('vendors')
      .insert({
        name,
        email,
        contact_phone: (formData.get('contact_phone') as string)?.trim() || null,
        gstin: (formData.get('gstin') as string)?.trim() || null,
        sla_days: formData.get('sla_days') ? parseInt(String(formData.get('sla_days')), 10) : 7,
        is_active: true,
      })
      .select()
      .single()

    if (error) return { error: error.message }
    revalidatePath('/ops')
    revalidatePath('/ops/vendors')
    return { success: true, data }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create vendor' }
  }
}

export async function updateVendor(id: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { error: 'Forbidden' }
    }

    const name = (formData.get('name') as string)?.trim()
    const email = (formData.get('email') as string)?.trim()
    if (!name || !email) return { error: 'Name and email are required' }

    const { error } = await supabase
      .from('vendors')
      .update({
        name,
        email,
        contact_phone: (formData.get('contact_phone') as string)?.trim() || null,
        gstin: (formData.get('gstin') as string)?.trim() || null,
        sla_days: formData.get('sla_days') ? parseInt(String(formData.get('sla_days')), 10) : 7,
        is_active: formData.get('is_active') === 'true',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/ops')
    revalidatePath('/ops/vendors')
    revalidatePath(`/ops/vendors/${id}`)
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update vendor' }
  }
}

export async function getVendorAssignments(vendorId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { data: [], vendor: null, error: 'Forbidden' }
    }

    const { data: vendor, error: vErr } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .single()
    if (vErr || !vendor) return { data: [], vendor: null, error: 'Vendor not found' }

    const { data: assignments, error: aErr } = await supabase
      .from('order_vendor_assignments')
      .select('id, order_id, status, cost, po_sent_at, tracking_number, created_at')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })

    if (aErr) return { data: [], vendor, error: aErr.message }

    const orderIds = [...new Set((assignments ?? []).map((a) => a.order_id))]
    const { data: orders } = orderIds.length
      ? await supabase.from('orders').select('id, order_number, total, currency, status').in('id', orderIds)
      : { data: [] }
    const orderMap = new Map((orders ?? []).map((o) => [o.id, o]))

    const data = (assignments ?? []).map((a) => ({
      ...a,
      order_number: orderMap.get(a.order_id)?.order_number ?? null,
      order_total: orderMap.get(a.order_id)?.total ?? null,
      order_currency: orderMap.get(a.order_id)?.currency ?? null,
    }))
    return { data, vendor, error: null }
  } catch (e) {
    return {
      data: [],
      vendor: null,
      error: e instanceof Error ? e.message : 'Failed to load assignments',
    }
  }
}

export async function assignVendorToOrder(orderId: string, vendorId: string, cost?: number) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (currentUser?.role !== 'SUPER_ADMIN') return { error: 'Forbidden' }

    const { error } = await supabase.from('order_vendor_assignments').insert({
      order_id: orderId,
      vendor_id: vendorId,
      status: 'PENDING',
      cost: cost ?? null,
    })
    if (error) return { error: error.message }
    revalidatePath('/ops')
    revalidatePath('/ops/campaigns')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to assign vendor' }
  }
}

export async function updateVendorAssignment(
  assignmentId: string,
  updates: { status?: string; tracking_number?: string }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { error: 'Forbidden' }
    }

    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (updates.status !== undefined) payload.status = updates.status
    if (updates.tracking_number !== undefined) payload.tracking_number = updates.tracking_number
    if (updates.status === 'SHIPPED' || updates.status === 'DELIVERED') {
      payload.po_sent_at = payload.po_sent_at ?? new Date().toISOString()
    }

    const { error } = await supabase
      .from('order_vendor_assignments')
      .update(payload)
      .eq('id', assignmentId)

    if (error) return { error: error.message }
    revalidatePath('/ops')
    revalidatePath('/ops/vendors')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update assignment' }
  }
}
