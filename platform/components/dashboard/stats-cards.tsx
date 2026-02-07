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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="rounded-2xl bg-muted/25 p-4 sm:rounded-xl sm:border sm:border-border/50 sm:bg-white sm:shadow-sm sm:hover:shadow-md sm:p-5 transition-all duration-200 overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
              <div className={`p-2 rounded-xl sm:p-2.5 ${stat.iconBg}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              {stat.change && (
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium shrink-0 sm:px-2 sm:py-1 sm:rounded-lg sm:text-xs ${
                    stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-600'
                  }`}
                >
                  {stat.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">
              {stat.label}
            </p>
            <p className="text-lg sm:text-2xl font-semibold text-foreground tracking-tight">
              {stat.value}
            </p>
            {stat.change && (
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-1.5">vs last month</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
