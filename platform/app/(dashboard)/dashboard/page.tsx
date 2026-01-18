import { StatsCards } from '@/components/dashboard/stats-cards'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { TopProducts } from '@/components/dashboard/top-products'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  return (
    <div className="space-y-8">
      {/* Welcome Header - Minimal Notion style */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-2">Welcome back, {userName}</h1>
        <p className="text-muted-foreground text-base">Here's what's happening with your gift platform today.</p>
      </div>
      
      {/* Stats Cards */}
      <StatsCards />
      
      {/* Charts and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <SalesChart />
        <TopProducts />
      </div>
      
      {/* Quick Actions and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
