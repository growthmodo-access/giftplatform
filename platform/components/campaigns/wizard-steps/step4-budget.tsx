'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CampaignWizardData } from '../campaign-wizard'
import { Calculator } from 'lucide-react'

interface Step4Props {
  data: CampaignWizardData
  onUpdate: (data: Partial<CampaignWizardData>) => void
}

export function CampaignStep4Budget({ data, onUpdate }: Step4Props) {
  const recipientCount = data.recipientType === 'ALL' 
    ? 'all employees' 
    : `${data.selectedRecipients.length} selected employee${data.selectedRecipients.length !== 1 ? 's' : ''}`

  const calculateTotal = () => {
    if (data.perRecipientBudget && data.selectedRecipients.length > 0) {
      return data.perRecipientBudget * data.selectedRecipients.length
    }
    return data.budget || 0
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Set Budget</h3>
        <p className="text-sm text-muted-foreground">
          Configure the budget for this campaign. Budget is optional but recommended for tracking.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-border/50 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Campaign Summary</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Recipients: {recipientCount}</div>
            <div>Gift Type: {
              data.giftType === 'SINGLE' ? 'Single Product' :
              data.giftType === 'CATALOG' ? 'Gift Catalog' :
              'Budget-Based'
            }</div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Budget Type</Label>
          <RadioGroup
            value={data.perRecipientBudget ? 'per_recipient' : data.budget ? 'total' : 'none'}
            onValueChange={(value) => {
              if (value === 'none') {
                onUpdate({ budget: null, perRecipientBudget: null })
              } else if (value === 'per_recipient') {
                onUpdate({ budget: null })
              } else {
                onUpdate({ perRecipientBudget: null })
              }
            }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-3 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="per_recipient" id="per_recipient" />
              <Label htmlFor="per_recipient" className="cursor-pointer flex-1">
                <div className="font-medium text-foreground">Per Recipient Budget</div>
                <div className="text-sm text-muted-foreground">Set a budget amount for each recipient</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="total" id="total" />
              <Label htmlFor="total" className="cursor-pointer flex-1">
                <div className="font-medium text-foreground">Total Campaign Budget</div>
                <div className="text-sm text-muted-foreground">Set a total budget for the entire campaign</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none" className="cursor-pointer flex-1">
                <div className="font-medium text-foreground">No Budget Limit</div>
                <div className="text-sm text-muted-foreground">Skip budget tracking for this campaign</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {data.perRecipientBudget !== null && (
          <div className="space-y-2">
            <Label htmlFor="per_recipient_budget" className="text-foreground">
              Per Recipient Budget ($)
            </Label>
            <Input
              id="per_recipient_budget"
              type="number"
              value={data.perRecipientBudget || ''}
              onChange={(e) => onUpdate({ perRecipientBudget: parseFloat(e.target.value) || null })}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="border-border/50"
            />
            {data.perRecipientBudget && data.selectedRecipients.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Estimated total: ${calculateTotal().toFixed(2)} ({data.selectedRecipients.length} recipients)
              </p>
            )}
          </div>
        )}

        {data.budget !== null && (
          <div className="space-y-2">
            <Label htmlFor="total_budget" className="text-foreground">
              Total Campaign Budget ($)
            </Label>
            <Input
              id="total_budget"
              type="number"
              value={data.budget || ''}
              onChange={(e) => onUpdate({ budget: parseFloat(e.target.value) || null })}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="border-border/50"
            />
          </div>
        )}
      </div>
    </div>
  )
}
