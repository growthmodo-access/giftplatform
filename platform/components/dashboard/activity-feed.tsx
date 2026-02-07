'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Users, Sparkles, TrendingUp, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Activity {
  id: string
  type: 'order' | 'employee' | 'campaign' | 'revenue'
  title: string
  description: string
  time: string
  icon: React.ComponentType<{ className?: string }>
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Simulate activity feed - in real app, fetch from API
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'order',
        title: 'New order placed',
        description: 'Order #ORD-12345 for $299.99',
        time: '2m ago',
        icon: Package,
      },
      {
        id: '2',
        type: 'revenue',
        title: 'Revenue milestone',
        description: 'Monthly revenue exceeded ₹10k',
        time: '1h ago',
        icon: TrendingUp,
      },
      {
        id: '3',
        type: 'employee',
        title: 'Employee added',
        description: 'Sarah Johnson joined the team',
        time: '3h ago',
        icon: Users,
      },
      {
        id: '4',
        type: 'campaign',
        title: 'Campaign activated',
        description: 'Holiday Gift Campaign is now live',
        time: '5h ago',
        icon: Sparkles,
      },
    ]

    setActivities(mockActivities)
  }, [])

  if (activities.length === 0) {
    return (
      <Card className="card-mobile-soft rounded-2xl border-0 bg-muted/20 shadow-none sm:rounded-xl sm:border sm:border-border/50 sm:bg-white sm:shadow-sm">
        <CardHeader className="pb-3 pt-4 sm:pt-5">
          <CardTitle className="text-base font-semibold text-foreground">Activity Feed</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-xl bg-muted/50 mb-3">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">No recent activity</p>
            <p className="text-sm text-muted-foreground">Activity will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-mobile-soft rounded-2xl border-0 bg-muted/20 shadow-none sm:rounded-xl sm:border sm:border-border/50 sm:bg-white sm:shadow-sm">
      <CardHeader className="pb-3 pt-4 sm:pt-5">
        <CardTitle className="text-base font-semibold text-foreground">Activity Feed</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Recent activity</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-2xl hover:bg-muted/40 active:bg-muted/50 transition-colors group sm:rounded-xl"
              >
                <div className="p-2 rounded-lg bg-muted/50 flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground mb-0.5">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
