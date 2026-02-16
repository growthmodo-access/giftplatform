'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Zap, Send } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { sendCampaignToEmployees, updateCampaignStatus, deleteCampaign } from '@/actions/campaigns'
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

interface CampaignsListProps {
  campaigns: Campaign[]
  currentUserRole: AppRole
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
  const { toast } = useToast()
  const [sending, setSending] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [sendDialogOpen, setSendDialogOpen] = useState<string | null>(null)

  const canManageCampaigns = currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN'
  const canDeleteCampaigns = currentUserRole === 'SUPER_ADMIN'

  const handleSendCampaign = async (campaignId: string) => {
    setSending(campaignId)
    setSendDialogOpen(null)
    const result = await sendCampaignToEmployees(campaignId)
    setSending(null)
    
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      toast({
        variant: "success",
        title: "Campaign Sent",
        description: `Campaign sent successfully! ${result.giftsSent || 0} gifts sent to employees.`,
      })
      router.refresh()
    }
  }

  const handleToggleStatus = async (campaignId: string, currentStatus: boolean) => {
    setToggling(campaignId)
    const result = await updateCampaignStatus(campaignId, !currentStatus)
    setToggling(null)
    
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      toast({
        variant: "success",
        title: "Campaign Updated",
        description: `Campaign ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      })
      router.refresh()
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    setDeleting(campaignId)
    setDeleteDialogOpen(null)
    const result = await deleteCampaign(campaignId)
    setDeleting(null)
    
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      toast({
        variant: "success",
        title: "Campaign Deleted",
        description: "Campaign deleted successfully.",
      })
      router.refresh()
    }
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="mb-4 p-4 rounded-full bg-muted/50">
          <Zap className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Create your first campaign to start sending gifts to your employees automatically.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="hover:shadow-md transition-shadow">
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
                <TooltipProvider>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleToggleStatus(campaign.id, campaign.is_active)}
                          disabled={toggling === campaign.id}
                        >
                          {toggling === campaign.id ? '...' : campaign.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{campaign.is_active ? 'Deactivate this campaign' : 'Activate this campaign'}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => setSendDialogOpen(campaign.id)}
                          disabled={sending === campaign.id || !campaign.is_active}
                        >
                          <Send className="w-4 h-4" />
                          {sending === campaign.id ? 'Sending...' : 'Send Now'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send this campaign to all eligible employees</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              )}
              {canDeleteCampaigns && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setDeleteDialogOpen(campaign.id)}
                  disabled={deleting === campaign.id}
                >
                  {deleting === campaign.id ? 'Deleting...' : 'Delete Campaign'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Send Campaign Confirmation Dialog */}
      {sendDialogOpen && (
        <AlertDialog open={!!sendDialogOpen} onOpenChange={(open) => !open && setSendDialogOpen(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send Campaign</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to send this campaign to all employees? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => sendDialogOpen && handleSendCampaign(sendDialogOpen)}>
                Send Campaign
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Campaign Confirmation Dialog */}
      {deleteDialogOpen && (
        <AlertDialog open={!!deleteDialogOpen} onOpenChange={(open) => !open && setDeleteDialogOpen(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this campaign? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteDialogOpen && handleDeleteCampaign(deleteDialogOpen)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
