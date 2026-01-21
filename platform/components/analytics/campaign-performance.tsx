'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Gift, Target, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CampaignPerformanceProps {
  timeRange: '7d' | '30d' | '90d' | '1y'
  detailed?: boolean
}

export function CampaignPerformance({ timeRange, detailed = false }: CampaignPerformanceProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: '1', name: 'New Hire Welcome', giftsSent: 45, target: 50, status: 'active', conversion: 90 },
        { id: '2', name: 'Birthday Celebration', giftsSent: 120, target: 150, status: 'active', conversion: 80 },
        { id: '3', name: 'Performance Reward', giftsSent: 28, target: 30, status: 'active', conversion: 93 },
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

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Campaign Performance
        </CardTitle>
        <CardDescription>Gift campaign metrics and conversion rates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((campaign) => (
            <div key={campaign.id} className="p-4 border border-border/50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{campaign.name}</h4>
                  <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                    {campaign.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Conversion</p>
                  <p className="text-lg font-semibold text-foreground">{campaign.conversion}%</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Gifts Sent</span>
                  <span className="font-medium text-foreground">{campaign.giftsSent} / {campaign.target}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-foreground h-2 rounded-full transition-all"
                    style={{ width: `${(campaign.giftsSent / campaign.target) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
