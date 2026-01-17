'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CreateCampaignDialog } from './create-campaign-dialog'
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

interface AutomationPageClientProps {
  campaigns: Campaign[]
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
}

export function AutomationPageClient({ campaigns, currentUserRole }: AutomationPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const canCreateCampaigns = currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER' || currentUserRole === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-600 mt-1">Automated gift campaigns</p>
        </div>
        {canCreateCampaigns && (
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        )}
      </div>

      <CampaignsList campaigns={campaigns} currentUserRole={currentUserRole} />

      {canCreateCampaigns && (
        <CreateCampaignDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </div>
  )
}
