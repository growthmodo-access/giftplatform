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
    <div className="space-y-8">
      {/* Welcome Header with Quick Actions */}
      <div className="pb-6 border-b border-border/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2">
            <p className="text-sm text-muted-foreground mb-1.5">
              {getTimeGreeting()} • {getFormattedDate()}
            </p>
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-2">
              Welcome back, {userName}
            </h1>
            <p className="text-muted-foreground text-base">
              {stats.todayOrders > 0 
                ? `You have ${stats.todayOrders} order${stats.todayOrders > 1 ? 's' : ''} today`
                : "Here's what's happening with your gift platform today."
              }
            </p>
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <StatsCards />
      
      {/* Charts and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <SalesChart />
        <TopProducts />
      </div>
      
      {/* Recent Orders and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
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
