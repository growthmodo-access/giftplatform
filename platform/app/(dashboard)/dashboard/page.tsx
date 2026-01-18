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
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-6 lg:p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
          <p className="text-indigo-100 text-sm lg:text-lg">Here's what's happening with your gift platform today.</p>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-48 h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 lg:w-48 lg:h-48 bg-white/5 rounded-full blur-2xl"></div>
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
