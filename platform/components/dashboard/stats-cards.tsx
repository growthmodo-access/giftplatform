import { Card } from '@/components/ui/card'
import { Package, Gift, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { getDashboardStats } from '@/actions/dashboard'

export async function StatsCards() {
  const { stats, canViewRevenue } = await getDashboardStats()

  const statsData = [
    {
      label: "Today's Orders",
      value: stats.todayOrders.toString(),
      change: stats.todayOrders > 0 ? '+' : '',
      trend: 'up' as const,
      icon: Package,
      iconBg: 'bg-primary/10 text-primary',
    },
    ...(canViewRevenue
      ? [
          {
            label: 'Total Revenue',
            value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`,
            change: stats.revenueChange >= 0 ? `+${stats.revenueChange.toFixed(1)}%` : `${stats.revenueChange.toFixed(1)}%`,
            trend: (stats.revenueChange >= 0 ? 'up' : 'down') as 'up' | 'down',
            icon: DollarSign,
            iconBg: 'bg-emerald-500/10 text-emerald-600',
          },
        ]
      : []),
    {
      label: 'Active Employees',
      value: stats.totalEmployees.toString(),
      change: '',
      trend: 'up' as const,
      icon: Users,
      iconBg: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Total Gifts Sent',
      value: stats.totalGifts.toString(),
      change: '',
      trend: 'up' as const,
      icon: Gift,
      iconBg: 'bg-amber-500/10 text-amber-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.label}
            className="bg-white border border-border/60 rounded-xl shadow-sm hover:shadow-md hover:border-border transition-all duration-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.change && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium shrink-0 ${
                      stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-semibold text-foreground tracking-tight">
                {stat.value}
              </p>
              {stat.change && (
                <p className="text-xs text-muted-foreground mt-1.5">vs last month</p>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
