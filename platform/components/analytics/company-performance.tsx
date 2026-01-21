'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, TrendingUp, Users, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CompanyPerformanceProps {
  timeRange: '7d' | '30d' | '90d' | '1y'
  canViewAll?: boolean
  detailed?: boolean
}

export function CompanyPerformance({ timeRange, canViewAll = false, detailed = false }: CompanyPerformanceProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated data - in real app, fetch from API
    setTimeout(() => {
      setData([
        { id: '1', name: 'Acme Corp', revenue: 45000, orders: 120, employees: 45, growth: 12.5 },
        { id: '2', name: 'TechStart Inc', revenue: 32000, orders: 85, employees: 32, growth: 8.3 },
        { id: '3', name: 'Global Solutions', revenue: 28000, orders: 72, employees: 28, growth: -2.1 },
      ])
      setLoading(false)
    }, 500)
  }, [timeRange])

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!canViewAll && !detailed) {
    return null // Don't show for non-super-admin in overview
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Company Performance
        </CardTitle>
        <CardDescription>Revenue and activity by company</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((company) => (
            <div key={company.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{company.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-semibold text-foreground">
                      ${(company.revenue / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Orders</p>
                    <p className="font-semibold text-foreground">{company.orders}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employees</p>
                    <p className="font-semibold text-foreground">{company.employees}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {company.growth >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                )}
                <span className={`text-sm font-medium ${company.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {company.growth > 0 ? '+' : ''}{company.growth.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
