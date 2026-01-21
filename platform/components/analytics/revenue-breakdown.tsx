'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface RevenueBreakdownProps {
  timeRange: '7d' | '30d' | '90d' | '1y'
}

export function RevenueBreakdown({ timeRange }: RevenueBreakdownProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      // Generate sample data
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
      const chartData = Array.from({ length: Math.min(days, 30) }, (_, i) => ({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.random() * 5000 + 1000,
        orders: Math.floor(Math.random() * 20) + 5,
      }))
      setData(chartData)
      setLoading(false)
    }, 500)
  }, [timeRange])

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-48 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const avgRevenue = totalRevenue / data.length

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Revenue Breakdown
        </CardTitle>
        <CardDescription>Daily revenue trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Daily Revenue</p>
              <p className="text-2xl font-semibold text-foreground">${avgRevenue.toFixed(0)}</p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+12.5%</span>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-1">
            {data.map((item, index) => {
              const height = (item.revenue / maxRevenue) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full flex items-end justify-center h-full">
                    <div
                      className="w-full rounded-t bg-foreground/80 hover:bg-foreground transition-all cursor-pointer group-hover:scale-105 origin-bottom"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`${item.date}: $${item.revenue.toFixed(0)}`}
                    />
                  </div>
                  {index % Math.ceil(data.length / 7) === 0 && (
                    <div className="mt-2 text-xs text-muted-foreground transform -rotate-45 origin-top-left whitespace-nowrap">
                      {item.date.split(' ')[0]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
