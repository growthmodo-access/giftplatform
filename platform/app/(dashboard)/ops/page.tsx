import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getOpsSummary, getOpsCampaigns } from '@/actions/ops'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import {
  ClipboardList,
  ChevronRight,
  Truck,
  Zap,
  Store,
  Package,
  ArrowRight,
} from 'lucide-react'

export default async function OpsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (currentUser?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const [summary, { data: campaigns, error }] = await Promise.all([
    getOpsSummary(),
    getOpsCampaigns(),
  ])

  const statCards = [
    { label: 'Campaigns', value: summary.campaignsCount, icon: Zap, href: null },
    { label: 'Campaign orders', value: summary.ordersCount, icon: Package, href: null },
    { label: 'Vendors', value: summary.vendorsCount, icon: Truck, href: '/ops/vendors' },
  ]

  const statusVariant = (status: string) => {
    switch (String(status).toUpperCase()) {
      case 'ACTIVE':
        return 'default'
      case 'DRAFT':
        return 'secondary'
      case 'COMPLETED':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-8 h-8" />
          Ops
        </h1>
        <p className="text-muted-foreground mt-1 max-w-xl">
          Campaigns, orders, and vendor assignments. Open a campaign to see orders and assign vendors, or manage vendors directly.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, href }) => {
          const content = (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
              {href && (
                <Link
                  href={href}
                  className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </>
          )
          if (href) {
            return (
              <Link key={label} href={href}>
                <Card className="border-border/50 hover:border-primary/30 hover:bg-muted/20 transition-colors h-full">
                  <CardContent className="pt-4">{content}</CardContent>
                </Card>
              </Link>
            )
          }
          return (
            <Card key={label} className="border-border/50 h-full">
              <CardContent className="pt-4">{content}</CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick nav: Campaigns vs Vendors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/ops/vendors">
          <Card className="border-border/50 hover:border-primary/30 hover:bg-muted/20 transition-colors h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-muted">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">Vendors</CardTitle>
              </div>
              <CardDescription>Add vendors, view assignments, and update status or tracking.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                Manage vendors <ArrowRight className="w-4 h-4" />
              </span>
            </CardContent>
          </Card>
        </Link>
        <Card className="border-border/50 opacity-90">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted">
                <Zap className="w-5 h-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">Campaigns</CardTitle>
            </div>
            <CardDescription>Orders and vendor assignments per campaign. Use the list below to open one.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <span className="text-sm text-muted-foreground">{campaigns?.length ?? 0} campaign{(campaigns?.length ?? 0) !== 1 ? 's' : ''} below</span>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns list */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Store className="w-5 h-5" />
            Campaigns
          </CardTitle>
          <CardDescription>Click a campaign to view orders and assign vendors</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}
          {!campaigns?.length ? (
            <p className="text-muted-foreground py-6 text-center">No campaigns yet. Campaigns created by companies will appear here.</p>
          ) : (
            <ul className="divide-y divide-border/50">
              {campaigns.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/ops/campaigns/${c.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 py-4 hover:bg-muted/30 -mx-2 px-3 rounded-lg transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {c.company_name && <span className="text-foreground/80">{c.company_name}</span>}
                        {c.company_name && ' · '}
                        {format(new Date(c.created_at), 'MMM d, yyyy')} · {c.recipient_count} recipient{c.recipient_count !== 1 ? 's' : ''} · {c.order_count} order{c.order_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
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
