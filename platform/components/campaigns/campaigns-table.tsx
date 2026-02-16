'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { Zap, Send, Edit, Trash2, MoreVertical } from 'lucide-react'
import { sendCampaignToEmployees, updateCampaignStatus, deleteCampaign } from '@/actions/campaigns'
import { EditCampaignDialog } from './edit-campaign-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AppRole } from '@/lib/roles'

type Campaign = {
  id: string
  name: string
  description?: string | null
  trigger: 'NEW_HIRE' | 'BIRTHDAY' | 'ANNIVERSARY' | 'PERFORMANCE' | 'CUSTOM'
  is_active: boolean
  product_id: string | null
  budget: number | null
  giftsSent: number
  campaign_identifier?: string | null
  products?: {
    id: string
    name: string
    price: number
  } | null
}

interface CampaignsTableProps {
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

export function CampaignsTable({ campaigns, currentUserRole }: CampaignsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [sending, setSending] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [sendDialogOpen, setSendDialogOpen] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

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

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setEditDialogOpen(true)
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
    <>
      <div className="border rounded-lg overflow-x-auto min-w-0">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead>Campaign ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Gifts Sent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {campaign.campaign_identifier || campaign.id.slice(0, 8)}
                  </code>
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div>{campaign.name}</div>
                    {campaign.description && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {campaign.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {triggerLabels[campaign.trigger] || campaign.trigger}
                  </Badge>
                </TableCell>
                <TableCell>
                  {campaign.products ? (
                    <div className="text-sm">
                      <div className="font-medium">{campaign.products.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(campaign.products.price)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {campaign.budget ? (
                    <span className="text-sm">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(campaign.budget)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{campaign.giftsSent || 0}</div>
                </TableCell>
                <TableCell>
                  <Badge className={campaign.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {campaign.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {canManageCampaigns && (
                    <TooltipProvider>
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Campaign actions</p>
                          </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(campaign.id, campaign.is_active)}
                            disabled={toggling === campaign.id}
                          >
                            {toggling === campaign.id ? '...' : campaign.is_active ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSendDialogOpen(campaign.id)}
                            disabled={sending === campaign.id || !campaign.is_active}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Now
                          </DropdownMenuItem>
                          {canDeleteCampaigns && (
                            <DropdownMenuItem
                              onClick={() => setDeleteDialogOpen(campaign.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Campaign Dialog */}
      {selectedCampaign && (
        <EditCampaignDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          campaign={selectedCampaign}
        />
      )}

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
    </>
  )
}
