import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getVendorAssignments } from '@/actions/vendors'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorFormDialog } from '../vendor-form-dialog'
import { UpdateAssignmentForm } from './update-assignment-form'

export default async function OpsVendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (currentUser?.role !== 'SUPER_ADMIN') redirect('/dashboard')

  const { data: assignments, vendor, error } = await getVendorAssignments(id)
  if (error || !vendor) {
    return (
      <div className="space-y-4">
        <Link href="/ops/vendors" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Vendors
        </Link>
        <p className="text-destructive">{error ?? 'Vendor not found'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/ops/vendors" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Vendors
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{vendor.name}</h1>
          <p className="text-muted-foreground">{vendor.email}</p>
          {vendor.contact_phone && <p className="text-sm text-muted-foreground">Phone: {vendor.contact_phone}</p>}
          {vendor.gstin && <p className="text-sm text-muted-foreground">GSTIN: {vendor.gstin}</p>}
        </div>
        <VendorFormDialog
          vendor={{
            id: vendor.id,
            name: vendor.name,
            email: vendor.email,
            contact_phone: vendor.contact_phone,
            gstin: vendor.gstin,
            sla_days: vendor.sla_days,
            is_active: vendor.is_active,
          }}
          trigger={<Button variant="outline" size="sm" className="border-border/50">Edit vendor</Button>}
        />
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Order assignments</CardTitle>
          <CardDescription>Orders assigned to this vendor. Update status and tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          {!assignments.length ? (
            <p className="text-muted-foreground">No orders assigned yet.</p>
          ) : (
            <ul className="space-y-4">
              {assignments.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/50 p-4">
                  <div>
                    <p className="font-medium text-foreground">{a.order_number ?? a.order_id}</p>
                    {a.order_total != null && (
                      <p className="text-sm text-muted-foreground">
                        {a.order_currency === 'INR' ? '₹' : '$'}
                        {a.order_total.toLocaleString()}
                      </p>
                    )}
                    <Badge variant="secondary" className="mt-1">{a.status}</Badge>
                    {a.tracking_number && (
                      <p className="text-xs text-muted-foreground mt-1">Tracking: {a.tracking_number}</p>
                    )}
                  </div>
                  <UpdateAssignmentForm assignmentId={a.id} currentStatus={a.status} currentTracking={a.tracking_number} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
