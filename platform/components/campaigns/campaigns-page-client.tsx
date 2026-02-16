'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Grid, List } from 'lucide-react'
import { CampaignWizard } from './campaign-wizard'
import { CampaignsList } from './campaigns-list'
import { CampaignsTable } from './campaigns-table'
import { CampaignsManagementClient } from './campaigns-management-client'
import type { AppRole } from '@/lib/roles'

type Campaign = {
  id: string
  name: string
  trigger: 'NEW_HIRE' | 'BIRTHDAY' | 'ANNIVERSARY' | 'PERFORMANCE' | 'CUSTOM'
  is_active: boolean
  product_id: string | null
  budget: number | null
  giftsSent: number
  products?: {
    id: string
    name: string
    price: number
  } | null
}

interface CampaignsPageClientProps {
  campaigns: Campaign[]
  managementCampaigns?: any[]
  currentUserRole: AppRole
}

export function CampaignsPageClient({ campaigns, managementCampaigns = [], currentUserRole }: CampaignsPageClientProps) {
  const router = useRouter()
  const [wizardOpen, setWizardOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const canCreateCampaigns = currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN'
  const canViewManagement = currentUserRole === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Gift Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            {canViewManagement 
              ? 'Create, manage, and monitor all gift campaigns across companies'
              : 'Create and manage gift campaigns for your employees'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border/50 rounded-md p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode('table')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
          {canCreateCampaigns && (
            <Button onClick={() => setWizardOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          )}
        </div>
      </div>

      {canViewManagement ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="border-border/50">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="management">Management View</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-6">
            {viewMode === 'table' ? (
              <CampaignsTable campaigns={campaigns} currentUserRole={currentUserRole} />
            ) : (
              <CampaignsList campaigns={campaigns} currentUserRole={currentUserRole} />
            )}
          </TabsContent>
          <TabsContent value="management" className="space-y-6">
            <CampaignsManagementClient 
              campaigns={managementCampaigns} 
              currentUserRole={currentUserRole} 
            />
          </TabsContent>
        </Tabs>
      ) : (
        viewMode === 'table' ? (
          <CampaignsTable campaigns={campaigns} currentUserRole={currentUserRole} />
        ) : (
          <CampaignsList campaigns={campaigns} currentUserRole={currentUserRole} />
        )
      )}

      {canCreateCampaigns && (
        <CampaignWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onSuccess={() => {
            setWizardOpen(false)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
