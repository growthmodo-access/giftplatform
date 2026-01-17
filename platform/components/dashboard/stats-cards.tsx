import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Package, Users } from 'lucide-react'

const stats = [
  {
    label: "Today's Orders",
    value: "142",
    change: "+12%",
    trend: "up",
    icon: Package,
  },
  {
    label: "Total Gifts Sent",
    value: "2,485",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Active Employees",
    value: "1,234",
    change: "+5%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Monthly Budget",
    value: "$45,230",
    change: "-3%",
    trend: "down",
    icon: TrendingDown,
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6 glass hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Icon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
