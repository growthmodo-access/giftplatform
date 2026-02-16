import { StatsCards } from '@/components/dashboard/stats-cards'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { TopProducts } from '@/components/dashboard/top-products'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { getCachedAuth } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import { getDashboardStats } from '@/actions/dashboard'
import { getTimeGreeting, getFormattedDate } from '@/lib/utils/dashboard'

export default async function DashboardPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')
  const { currentUser } = auth
  const userName = currentUser.name ?? currentUser.email?.split('@')[0] ?? 'there'
  const { stats } = await getDashboardStats()

  return (
    <div className="space-y-6 sm:space-y-6 lg:space-y-8 min-w-0">
      {/* Page title + context — reference-style header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {getTimeGreeting()}, {userName} · {getFormattedDate()}
          </p>
        </div>
        <p className="text-sm text-muted-foreground sm:text-right">
          {stats.todayOrders > 0 
            ? `${stats.todayOrders} order${stats.todayOrders > 1 ? 's' : ''} today`
            : 'Overview of your gift platform'
          }
        </p>
      </div>

      {/* Quick Actions — subtle strip */}
      <QuickActions />
      
      {/* KPI Stats */}
      <StatsCards />
      
      {/* Charts and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-w-0">
        <SalesChart />
        <TopProducts />
      </div>
      
      {/* Recent Orders and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
