'use client'

import { Card } from '@/components/ui/card'
import { Package, Gift, Users, DollarSign, TrendingUp, TrendingDown, Building2, Target, Zap, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getEnhancedAnalytics } from '@/actions/analytics'

interface EnhancedStatsCardsProps {
  timeRange: '7d' | '30d' | '90d' | '1y'
}

export function EnhancedStatsCards({ timeRange }: EnhancedStatsCardsProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      const result = await getEnhancedAnalytics(timeRange)
      if (result.data) {
        setStats(result.data)
      }
      setLoading(false)
    }
    fetchStats()
  }, [timeRange])

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50 animate-pulse">
            <div className="p-6 h-32 bg-muted/50" />
          </Card>
        ))}
      </div>
    )
  }

  const canViewRevenue = stats.canViewRevenue === true
  const statsData = [
    ...(canViewRevenue
      ? [
          {
            label: "Total Revenue",
            value: `₹${(stats.totalRevenue / 1000).toFixed(1)}k`,
            change: stats.revenueChange,
            trend: (stats.revenueChange >= 0 ? "up" : "down") as "up" | "down",
            icon: DollarSign,
            description: `${stats.totalOrders} orders`,
          },
        ]
      : []),
    {
      label: "Active Campaigns",
      value: stats.activeCampaigns.toString(),
      change: stats.campaignsChange,
      trend: stats.campaignsChange >= 0 ? "up" : "down",
      icon: Zap,
      description: `${stats.giftsSent} gifts sent`,
    },
    {
      label: "Total Employees",
      value: stats.totalEmployees.toString(),
      change: stats.employeesChange,
      trend: stats.employeesChange >= 0 ? "up" : "down",
      icon: Users,
      description: `${stats.activeEmployees} active`,
    },
    {
      label: "Companies",
      value: stats.totalCompanies.toString(),
      change: stats.companiesChange,
      trend: stats.companiesChange >= 0 ? "up" : "down",
      icon: Building2,
      description: `${stats.activeCompanies} active`,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card 
            key={stat.label} 
            className="border border-border/50 bg-card hover:border-foreground/20 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                {stat.change !== undefined && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    stat.trend === 'up' 
                      ? 'bg-green-100 text-green-700' 
                      : stat.trend === 'down'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : stat.trend === 'down' ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    {stat.change !== undefined && stat.change !== 0 && (
                      <span>{stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%</span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-3xl font-semibold text-foreground tracking-tight mb-1">
                  {stat.value}
                </p>
                {stat.description && (
                  <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
