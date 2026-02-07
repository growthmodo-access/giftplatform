import { Package, Gift, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { getDashboardStats } from '@/actions/dashboard'
import { formatCurrencyShort } from '@/lib/currency'

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
            value: formatCurrencyShort(stats.totalRevenue, 'INR'),
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-border/40 bg-white p-5 shadow-sm transition-shadow hover:shadow-md overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              {stat.change && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium shrink-0 ${
                    stat.trend === 'up' ? 'text-emerald-600 bg-emerald-500/10' : 'text-red-600 bg-red-500/10'
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
            <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {stat.value}
            </p>
            {stat.change && (
              <p className="text-xs text-muted-foreground mt-1.5">from last month</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
