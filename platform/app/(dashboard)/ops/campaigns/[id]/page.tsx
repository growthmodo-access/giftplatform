import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCampaignOrdersWithVendors } from '@/actions/ops'
import { getVendors } from '@/actions/vendors'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { AssignVendorButton } from './assign-vendor-button'

export default async function OpsCampaignOrdersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: campaignId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (currentUser?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const [{ data: orders, campaign, error }, { data: vendors }] = await Promise.all([
    getCampaignOrdersWithVendors(campaignId),
    getVendors(),
  ])
  const vendorList = (vendors ?? []).map((v) => ({ id: v.id, name: v.name }))

  if (error || !campaign) {
    return (
      <div className="space-y-4">
        <Link href="/ops" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Ops
        </Link>
        <p className="text-destructive">{error ?? 'Campaign not found'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/ops" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Ops
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{campaign.name}</h1>
        <p className="text-muted-foreground">Orders and vendor assignments for this campaign.</p>
        <a
          href={`/api/campaigns/${campaignId}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline mt-2 inline-block"
        >
          View / Print Indian GST invoice →
        </a>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Orders</CardTitle>
          <CardDescription>Orders placed from this campaign (via gift selection)</CardDescription>
        </CardHeader>
        <CardContent>
          {!orders.length ? (
            <p className="text-muted-foreground">No orders yet for this campaign.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-border/50 p-4 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.recipient_name ?? order.recipient_email ?? '—'} · {order.currency} {order.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <AssignVendorButton
                        orderId={order.id}
                        orderNumber={order.order_number}
                        vendors={vendorList}
                      />
                      <Badge variant="secondary">{order.status}</Badge>
                    </div>
                  </div>
                  {order.vendor_assignments.length > 0 && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Vendor assignments</p>
                      <ul className="text-sm space-y-1">
                        {order.vendor_assignments.map((a) => (
                          <li key={a.id} className="flex flex-wrap items-center gap-2">
                            <span className="text-foreground">{a.vendor_name}</span>
                            <Badge className="text-xs">{a.status}</Badge>
                            {a.cost != null && <span className="text-muted-foreground">Cost: {order.currency === 'INR' ? '₹' : '$'}{a.cost}</span>}
                            {a.tracking_number && <span className="text-muted-foreground">Tracking: {a.tracking_number}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
