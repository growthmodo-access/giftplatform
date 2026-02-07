'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import {
  ClipboardList,
  ChevronRight,
  Truck,
  Zap,
  Store,
  Package,
  ArrowRight,
  Search,
} from 'lucide-react'

type Campaign = {
  id: string
  name: string
  company_name: string | null
  status: string
  created_at: string
  recipient_count: number
  order_count: number
}

type Summary = {
  campaignsCount: number
  ordersCount: number
  vendorsCount: number
}

interface OpsPageClientProps {
  summary: Summary
  campaigns: Campaign[]
  error: string | null
}

const statusVariant = (status: string): 'default' | 'secondary' | 'outline' => {
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

export function OpsPageClient({ summary, campaigns, error }: OpsPageClientProps) {
  const [search, setSearch] = useState('')

  const filteredCampaigns = useMemo(() => {
    if (!search.trim()) return campaigns || []
    const q = search.trim().toLowerCase()
    return (campaigns || []).filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.company_name || '').toLowerCase().includes(q)
    )
  }, [campaigns, search])

  const statCards = [
    { label: 'Campaigns', value: summary.campaignsCount, icon: Zap, href: null as string | null },
    { label: 'Campaign orders', value: summary.ordersCount, icon: Package, href: null },
    { label: 'Vendors', value: summary.vendorsCount, icon: Truck, href: '/ops/vendors' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-7 h-7 sm:w-8 sm:h-8" />
          Ops
        </h1>
        <p className="text-muted-foreground mt-1 max-w-xl text-sm sm:text-base">
          Campaigns, orders, and vendor assignments. Open a campaign to see orders and assign vendors, or manage vendors directly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, href }) => {
          const content = (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</span>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{value}</p>
              {href && (
                <Link
                  href={href}
                  className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1 font-medium"
                >
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </>
          )
          if (href) {
            return (
              <Link key={label} href={href}>
                <Card className="rounded-xl border border-border/40 bg-white shadow-sm hover:shadow-md hover:border-primary/20 transition-all h-full">
                  <CardContent className="pt-4 pb-4">{content}</CardContent>
                </Card>
              </Link>
            )
          }
          return (
            <Card key={label} className="rounded-xl border border-border/40 bg-white shadow-sm h-full">
              <CardContent className="pt-4 pb-4">{content}</CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/ops/vendors">
          <Card className="rounded-xl border border-border/40 bg-white shadow-sm hover:shadow-md hover:border-primary/20 transition-all h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-muted/50">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">Vendors</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Add vendors, view assignments, and update status or tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                Manage vendors <ArrowRight className="w-4 h-4" />
              </span>
            </CardContent>
          </Card>
        </Link>
        <Card className="rounded-xl border border-border/40 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted/50">
                <Zap className="w-5 h-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">Campaigns</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Orders and vendor assignments per campaign. Search and open one below.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <span className="text-sm text-muted-foreground">
              {campaigns?.length ?? 0} campaign{(campaigns?.length ?? 0) !== 1 ? 's' : ''} total
            </span>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border border-border/40 bg-white shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Store className="w-5 h-5" />
                Campaigns
              </CardTitle>
              <CardDescription className="text-sm">Click a campaign to view orders and assign vendors</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm border-border/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}
          {!filteredCampaigns.length ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              {search ? 'No campaigns match your search.' : 'No campaigns yet. Campaigns created by companies will appear here.'}
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {filteredCampaigns.map((c) => (
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
                        {format(new Date(c.created_at), 'MMM d, yyyy')} · {c.recipient_count} recipient{c.recipient_count !== 1 ? 's' : ''} · {c.order_count} redeemed
                        {c.recipient_count > 0 ? ` (${Math.round((c.order_count / c.recipient_count) * 100)}%)` : ''}
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
