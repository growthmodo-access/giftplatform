import { getCampaignInvoiceData, renderCampaignInvoiceHtml } from '@/lib/invoice-campaign'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: campaignId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const { data: currentUser } = await supabase.from('users').select('role, company_id').eq('id', user.id).single()
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER']
  if (!currentUser || !allowedRoles.includes(currentUser.role ?? '')) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  const { data: campaign } = await supabase.from('campaigns').select('company_id').eq('id', campaignId).single()
  if (currentUser.role !== 'SUPER_ADMIN' && campaign?.company_id !== currentUser.company_id) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  const { data, error } = await getCampaignInvoiceData(campaignId)
  if (error || !data) {
    return new NextResponse(error ?? 'Not found', { status: 404 })
  }
  const html = renderCampaignInvoiceHtml(data)
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
