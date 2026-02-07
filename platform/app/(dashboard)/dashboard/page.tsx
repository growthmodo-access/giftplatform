import { StatsCards } from '@/components/dashboard/stats-cards'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { TopProducts } from '@/components/dashboard/top-products'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDashboardStats } from '@/actions/dashboard'
import { getTimeGreeting, getFormattedDate } from '@/lib/utils/dashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('name, email')
    .eq('id', user.id)
    .single()

  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'there'
  const { stats } = await getDashboardStats()

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8 min-w-0">
      {/* Quick Actions - horizontal strip across all dashboards */}
      <QuickActions />

      {/* Welcome Header */}
      <div className="pb-4 sm:pb-6 border-b border-border/50">
        <p className="text-xs sm:text-sm text-muted-foreground mb-1.5">
          {getTimeGreeting()} • {getFormattedDate()}
        </p>
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-foreground mb-2 break-words leading-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-snug">
          {stats.todayOrders > 0 
            ? `You have ${stats.todayOrders} order${stats.todayOrders > 1 ? 's' : ''} today`
            : "Here's what's happening with your gift platform today."
          }
        </p>
      </div>
      
      {/* Stats Cards */}
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
