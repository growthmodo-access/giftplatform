import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getOpsCampaigns } from '@/actions/ops'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ClipboardList, ChevronRight, Truck } from 'lucide-react'

export default async function OpsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (currentUser?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const { data: campaigns, error } = await getOpsCampaigns()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-8 h-8" />
          Ops
        </h1>
        <p className="text-muted-foreground mt-1">
          Campaigns, orders, and vendor assignments. Drill into a campaign to see orders and assign vendors.
        </p>
        <Link href="/ops/vendors" className="text-sm text-primary hover:underline mt-2 inline-block">
          Manage vendors →
        </Link>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Campaigns</CardTitle>
          <CardDescription>Click a campaign to view orders and vendor assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}
          {!campaigns?.length ? (
            <p className="text-muted-foreground">No campaigns yet.</p>
          ) : (
            <ul className="divide-y divide-border/50">
              {campaigns.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/ops/campaigns/${c.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 py-4 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(c.created_at), 'PPP')} · {c.recipient_count} recipient{c.recipient_count !== 1 ? 's' : ''} · {c.order_count} order{c.order_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{c.status}</Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
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
