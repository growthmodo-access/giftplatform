'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CampaignStep1Details } from './wizard-steps/step1-details'
import { CampaignStep2Recipients } from './wizard-steps/step2-recipients'
import { CampaignStep3Gifts } from './wizard-steps/step3-gifts'
import { CampaignStep4Budget } from './wizard-steps/step4-budget'
import { CampaignStep5Schedule } from './wizard-steps/step5-schedule'
import { CampaignStep6Preview } from './wizard-steps/step6-preview'
import { X } from 'lucide-react'

interface CampaignWizardProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export interface CampaignWizardData {
  name: string
  description: string
  recipientType: 'ALL' | 'SELECTED' | 'TEAM' | 'DEPARTMENT'
  selectedRecipients: string[]
  giftType: 'SINGLE' | 'CATALOG' | 'BUDGET'
  selectedProducts: string[]
  budget: number | null
  perRecipientBudget: number | null
  scheduleType: 'NOW' | 'SCHEDULED'
  scheduledDate: Date | null
  customMessage: string
}

const STEPS = [
  { id: 1, title: 'Campaign Details' },
  { id: 2, title: 'Select Recipients' },
  { id: 3, title: 'Choose Gifts' },
  { id: 4, title: 'Set Budget' },
  { id: 5, title: 'Schedule' },
  { id: 6, title: 'Review & Send' },
]

export function CampaignWizard({ open, onClose, onSuccess }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [campaignData, setCampaignData] = useState<CampaignWizardData>({
    name: '',
    description: '',
    recipientType: 'ALL',
    selectedRecipients: [],
    giftType: 'SINGLE',
    selectedProducts: [],
    budget: null,
    perRecipientBudget: null,
    scheduleType: 'NOW',
    scheduledDate: null,
    customMessage: '',
  })

  const progress = (currentStep / STEPS.length) * 100

  const handleNext = () => {
    // Validate current step before proceeding
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!campaignData.name.trim()
      case 2:
        return campaignData.recipientType === 'ALL' || campaignData.selectedRecipients.length > 0
      case 3:
        if (campaignData.giftType === 'SINGLE') {
          return campaignData.selectedProducts.length === 1
        } else if (campaignData.giftType === 'CATALOG') {
          return campaignData.selectedProducts.length > 0
        }
        return true // BUDGET type doesn't need product selection
      case 4:
        return true // Budget is optional
      case 5:
        return true // Schedule validation handled in step
      default:
        return true
    }
  }

  const handleDataUpdate = (data: Partial<CampaignWizardData>) => {
    setCampaignData(prev => ({ ...prev, ...data }))
  }

  const handleClose = () => {
    if (currentStep === 1 || confirm('Are you sure you want to close? Your progress will be lost.')) {
      setCurrentStep(1)
      setCampaignData({
        name: '',
        description: '',
        recipientType: 'ALL',
        selectedRecipients: [],
        giftType: 'SINGLE',
        selectedProducts: [],
        budget: null,
        perRecipientBudget: null,
        scheduleType: 'NOW',
        scheduledDate: null,
        customMessage: '',
      })
      onClose()
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CampaignStep1Details data={campaignData} onUpdate={handleDataUpdate} />
      case 2:
        return <CampaignStep2Recipients data={campaignData} onUpdate={handleDataUpdate} />
      case 3:
        return <CampaignStep3Gifts data={campaignData} onUpdate={handleDataUpdate} />
      case 4:
        return <CampaignStep4Budget data={campaignData} onUpdate={handleDataUpdate} />
      case 5:
        return <CampaignStep5Schedule data={campaignData} onUpdate={handleDataUpdate} />
      case 6:
        return <CampaignStep6Preview data={campaignData} onUpdate={handleDataUpdate} onSuccess={onSuccess} onClose={handleClose} onBack={handleBack} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-border/50">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground">Create Gift Campaign</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="border-border/50">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Step {currentStep} of {STEPS.length}</span>
            <span className="font-medium text-foreground">{STEPS[currentStep - 1].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((step) => (
              <span 
                key={step.id} 
                className={currentStep >= step.id ? 'text-foreground font-medium' : ''}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px] py-4">
          {renderStep()}
        </div>

        {/* Navigation - Only show for steps 1-5 */}
        {currentStep < 6 && (
          <div className="flex justify-between pt-4 border-t border-border/50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack} 
              disabled={currentStep === 1}
              className="border-border/50"
            >
              Back
            </Button>
            <Button 
              type="button" 
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
            >
              Next
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
