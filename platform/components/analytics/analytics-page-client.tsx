'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Calendar, TrendingUp, TrendingDown, Building2, Users, Gift, DollarSign, Package, Target } from 'lucide-react'
import { EnhancedStatsCards } from './enhanced-stats-cards'
import { CompanyPerformance } from './company-performance'
import { CampaignPerformance } from './campaign-performance'
import { RevenueBreakdown } from './revenue-breakdown'
import { EmployeeEngagement } from './employee-engagement'
import type { AppRole } from '@/lib/roles'

interface AnalyticsPageClientProps {
  initialData: any
  currentUserRole: AppRole
}

export function AnalyticsPageClient({ initialData, currentUserRole }: AnalyticsPageClientProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [viewMode, setViewMode] = useState<'overview' | 'companies' | 'campaigns' | 'employees'>('overview')

  const canViewAllCompanies = currentUserRole === 'SUPER_ADMIN'
  const canViewRevenue = currentUserRole === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">Comprehensive performance metrics and detailed reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-[140px] border-border/50">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2 border-border/50">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-border/50">
        <Button
          variant={viewMode === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('overview')}
          className="rounded-b-none"
        >
          Overview
        </Button>
        {canViewAllCompanies && (
          <Button
            variant={viewMode === 'companies' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('companies')}
            className="rounded-b-none"
          >
            Companies
          </Button>
        )}
        <Button
          variant={viewMode === 'campaigns' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('campaigns')}
          className="rounded-b-none"
        >
          Campaigns
        </Button>
        <Button
          variant={viewMode === 'employees' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('employees')}
          className="rounded-b-none"
        >
          Employees
        </Button>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'overview' && (
        <>
          <EnhancedStatsCards timeRange={timeRange} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {canViewRevenue && <RevenueBreakdown timeRange={timeRange} />}
            <CompanyPerformance timeRange={timeRange} canViewAll={canViewAllCompanies} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CampaignPerformance timeRange={timeRange} />
            <EmployeeEngagement timeRange={timeRange} />
          </div>
        </>
      )}

      {viewMode === 'companies' && canViewAllCompanies && (
        <CompanyPerformance timeRange={timeRange} canViewAll={true} detailed={true} />
      )}

      {viewMode === 'campaigns' && (
        <CampaignPerformance timeRange={timeRange} detailed={true} />
      )}

      {viewMode === 'employees' && (
        <EmployeeEngagement timeRange={timeRange} detailed={true} />
      )}
    </div>
  )
}
