'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CampaignWizardData } from '../campaign-wizard'

interface Step1Props {
  data: CampaignWizardData
  onUpdate: (data: Partial<CampaignWizardData>) => void
}

export function CampaignStep1Details({ data, onUpdate }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Campaign Details</h3>
        <p className="text-sm text-muted-foreground">
          Give your campaign a name and description to help you identify it later.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Campaign Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g., Q4 Employee Appreciation"
          className="border-border/50"
          required
        />
        <p className="text-xs text-muted-foreground">
          Choose a descriptive name for this campaign
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe the purpose of this campaign, what occasion it's for, or any special instructions..."
          className="border-border/50"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Optional: Add more context about this campaign
        </p>
      </div>
    </div>
  )
}
