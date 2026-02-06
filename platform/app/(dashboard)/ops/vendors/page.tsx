import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getVendors } from '@/actions/vendors'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClipboardList, Plus, ChevronRight } from 'lucide-react'
import { VendorFormDialog } from './vendor-form-dialog'

export default async function OpsVendorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (currentUser?.role !== 'SUPER_ADMIN') redirect('/dashboard')

  const { data: vendors, error } = await getVendors()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/ops" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Ops</Link>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Vendors
          </h1>
          <p className="text-muted-foreground mt-1">Manage vendors and view assignments.</p>
        </div>
        <VendorFormDialog trigger={<Button><Plus className="w-4 h-4 mr-2" /> Add vendor</Button>} />
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">All vendors</CardTitle>
          <CardDescription>Click a vendor to view orders and update status.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}
          {!vendors?.length ? (
            <p className="text-muted-foreground">No vendors yet. Add one to get started.</p>
          ) : (
            <ul className="divide-y divide-border/50">
              {vendors.map((v) => (
                <li key={v.id}>
                  <Link
                    href={`/ops/vendors/${v.id}`}
                    className="flex items-center justify-between py-4 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{v.name}</p>
                      <p className="text-sm text-muted-foreground">{v.email}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
