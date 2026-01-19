'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CampaignWizard } from './campaign-wizard'
import { CampaignsList } from './campaigns-list'

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
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
}

export function CampaignsPageClient({ campaigns, currentUserRole }: CampaignsPageClientProps) {
  const router = useRouter()
  const [wizardOpen, setWizardOpen] = useState(false)
  const canCreateCampaigns = currentUserRole === 'ADMIN' || currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Gift Campaigns</h1>
          <p className="text-muted-foreground mt-1">Create and manage gift campaigns for your employees</p>
        </div>
        {canCreateCampaigns && (
          <Button onClick={() => setWizardOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        )}
      </div>

      <CampaignsList campaigns={campaigns} currentUserRole={currentUserRole} />

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
