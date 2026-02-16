'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, Package, Gift, DollarSign } from 'lucide-react'
import Image from 'next/image'
import type { AppRole } from '@/lib/roles'

type Campaign = {
  id: string
  name: string
  company: string
  companyId: string | null
  employeeCount: number
  product: string
  productId: string | null
  productPrice: number
  productCurrency: string
  productImage: string | null
  trigger: string
  budget: number | null
  giftsSent: number
  isActive: boolean
  createdAt: string
}

interface CampaignsManagementClientProps {
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

export function CampaignsManagementClient({ campaigns, currentUserRole }: CampaignsManagementClientProps) {
  if (campaigns.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Active Campaigns Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all active campaigns across companies</p>
        </div>
        <Card className="border-border/50">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              No active campaigns found.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Active Campaigns Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all active campaigns across companies</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{campaigns.length}</p>
              </div>
              <Gift className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="text-2xl font-semibold text-foreground mt-1">
                  {new Set(campaigns.map(c => c.companyId).filter(Boolean)).size}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-semibold text-foreground mt-1">
                  {campaigns.reduce((sum, c) => sum + c.employeeCount, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gifts Sent</p>
                <p className="text-2xl font-semibold text-foreground mt-1">
                  {campaigns.reduce((sum, c) => sum + c.giftsSent, 0)}
                </p>
              </div>
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Campaigns Overview</CardTitle>
          <CardDescription>Detailed view of all active campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Gifts Sent</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{campaign.company}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{campaign.employeeCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {campaign.productImage && (
                          <img 
                            src={campaign.productImage} 
                            alt={campaign.product}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{campaign.product}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: campaign.productCurrency,
                            }).format(campaign.productPrice)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaign.budget ? (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>{new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(campaign.budget)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{campaign.giftsSent}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {triggerLabels[campaign.trigger] || campaign.trigger}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={campaign.isActive ? 'default' : 'secondary'}>
                        {campaign.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
