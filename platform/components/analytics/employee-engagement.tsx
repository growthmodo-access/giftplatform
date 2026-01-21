'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Gift, Award, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface EmployeeEngagementProps {
  timeRange: '7d' | '30d' | '90d' | '1y'
  detailed?: boolean
}

export function EmployeeEngagement({ timeRange, detailed = false }: EmployeeEngagementProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setData({
        totalEmployees: 145,
        activeEmployees: 132,
        giftsReceived: 89,
        avgGiftsPerEmployee: 2.3,
        topPerformers: [
          { name: 'John Doe', gifts: 5, department: 'Sales' },
          { name: 'Jane Smith', gifts: 4, department: 'Marketing' },
          { name: 'Mike Johnson', gifts: 4, department: 'Engineering' },
        ],
      })
      setLoading(false)
    }, 500)
  }, [timeRange])

  if (loading || !data) {
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

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Employee Engagement
        </CardTitle>
        <CardDescription>Gift distribution and employee activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-border/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Active Employees</p>
              </div>
              <p className="text-2xl font-semibold text-foreground">{data.activeEmployees}</p>
              <p className="text-xs text-muted-foreground mt-1">of {data.totalEmployees} total</p>
            </div>
            <div className="p-4 border border-border/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Gifts Received</p>
              </div>
              <p className="text-2xl font-semibold text-foreground">{data.giftsReceived}</p>
              <p className="text-xs text-muted-foreground mt-1">Avg: {data.avgGiftsPerEmployee} per employee</p>
            </div>
          </div>
          
          {detailed && (
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Top Performers
              </h4>
              <div className="space-y-2">
                {data.topPerformers.map((performer: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{performer.name}</p>
                      <p className="text-sm text-muted-foreground">{performer.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{performer.gifts}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
