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
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100/50",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`,
      change: stats.revenueChange >= 0 ? `+${stats.revenueChange.toFixed(1)}%` : `${stats.revenueChange.toFixed(1)}%`,
      trend: stats.revenueChange >= 0 ? "up" : "down",
      icon: DollarSign,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100/50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Active Employees",
      value: stats.totalEmployees.toString(),
      change: "",
      trend: "up",
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100/50",
      iconColor: "text-purple-600",
    },
    {
      label: "Total Gifts Sent",
      value: stats.totalGifts.toString(),
      change: "",
      trend: "up",
      icon: Gift,
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100/50",
      iconColor: "text-pink-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <Card 
            key={stat.label} 
            className="relative overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="relative p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className={`p-2.5 lg:p-3 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stat.trend === 'up' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
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
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1 lg:mb-2">{stat.label}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-gray-500">vs last month</p>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
