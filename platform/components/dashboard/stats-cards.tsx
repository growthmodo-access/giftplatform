import { Card } from '@/components/ui/card'
import { Package, Gift, Users, DollarSign, TrendingUp, TrendingDown, Sparkles, Target } from 'lucide-react'
import { getDashboardStats } from '@/actions/dashboard'

export async function StatsCards() {
  const { stats } = await getDashboardStats()

  const statsData = [
    {
      label: "Today's Orders",
      value: stats.todayOrders.toString(),
      change: stats.todayOrders > 0 ? "+" : "",
      trend: "up",
      icon: Package,
    },
    {
      label: "Total Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`,
      change: stats.revenueChange >= 0 ? `+${stats.revenueChange.toFixed(1)}%` : `${stats.revenueChange.toFixed(1)}%`,
      trend: stats.revenueChange >= 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      label: "Active Employees",
      value: stats.totalEmployees.toString(),
      change: "",
      trend: "up",
      icon: Users,
    },
    {
      label: "Total Gifts Sent",
      value: stats.totalGifts.toString(),
      change: "",
      trend: "up",
      icon: Gift,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <Card 
            key={stat.label} 
            className="border border-border bg-card hover:border-foreground/20 transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-md bg-muted">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    stat.trend === 'up' 
                      ? 'bg-muted text-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-semibold text-foreground tracking-tight">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-muted-foreground mt-1">vs last month</p>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
