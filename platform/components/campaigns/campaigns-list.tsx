'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Send } from 'lucide-react'
import { sendCampaignToEmployees, updateCampaignStatus } from '@/actions/campaigns'

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

interface CampaignsListProps {
  campaigns: Campaign[]
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
}

const triggerLabels: Record<string, string> = {
  NEW_HIRE: 'New Hire',
  BIRTHDAY: 'Birthday',
  ANNIVERSARY: 'Anniversary',
  PERFORMANCE: 'Performance',
  CUSTOM: 'Custom',
}

export function CampaignsList({ campaigns, currentUserRole }: CampaignsListProps) {
  const router = useRouter()
  const [sending, setSending] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const canManageCampaigns = currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER' || currentUserRole === 'SUPER_ADMIN'

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign to all employees?')) {
      return
    }

    setSending(campaignId)
    const result = await sendCampaignToEmployees(campaignId)
    setSending(null)
    
    if (result.error) {
      alert(result.error)
    } else {
      alert(`Campaign sent successfully! ${result.giftsSent} gifts sent to employees.`)
      router.refresh()
    }
  }

  const handleToggleStatus = async (campaignId: string, currentStatus: boolean) => {
    setToggling(campaignId)
    const result = await updateCampaignStatus(campaignId, !currentStatus)
    setToggling(null)
    
    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No campaigns found. Create your first campaign to get started.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="glass hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <Badge className={campaign.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {campaign.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <CardTitle className="mt-4">{campaign.name}</CardTitle>
            <CardDescription>Trigger: {triggerLabels[campaign.trigger] || campaign.trigger}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{campaign.giftsSent}</p>
                  <p className="text-sm text-gray-600">Gifts sent</p>
                </div>
              </div>
              {campaign.products && (
                <div className="text-sm text-gray-600">
                  Product: {campaign.products.name}
                </div>
              )}
              {canManageCampaigns && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleStatus(campaign.id, campaign.is_active)}
                    disabled={toggling === campaign.id}
                  >
                    {toggling === campaign.id ? '...' : campaign.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleSendCampaign(campaign.id)}
                    disabled={sending === campaign.id || !campaign.is_active}
                  >
                    <Send className="w-4 h-4" />
                    {sending === campaign.id ? 'Sending...' : 'Send Now'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
