'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createGiftCampaign } from '@/actions/campaigns'
import { Loader2, Check, Users, Gift, DollarSign, Calendar, MessageSquare } from 'lucide-react'
import { CampaignWizardData } from '../campaign-wizard'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { useEffect } from 'react'

interface Step6Props {
  data: CampaignWizardData
  onUpdate: (data: Partial<CampaignWizardData>) => void
  onSuccess: () => void
  onClose: () => void
  onBack?: () => void
}

export function CampaignStep6Preview({ data, onSuccess, onClose, onBack }: Step6Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Load products
    if (data.selectedProducts.length > 0) {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .in('id', data.selectedProducts)
      if (productsData) setProducts(productsData)
    }

    // Load employees
    if (data.selectedRecipients.length > 0) {
      const { data: employeesData } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', data.selectedRecipients)
      if (employeesData) setEmployees(employeesData)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('campaign_type', 'MANUAL')
      formData.append('recipient_type', data.recipientType)
      formData.append('recipient_ids', JSON.stringify(data.selectedRecipients))
      formData.append('gift_type', data.giftType)
      formData.append('selected_products', JSON.stringify(data.selectedProducts))
      formData.append('budget', data.budget?.toString() || '')
      formData.append('per_recipient_budget', data.perRecipientBudget?.toString() || '')
      formData.append('schedule_type', data.scheduleType)
      if (data.scheduledDate) {
        formData.append('scheduled_date', data.scheduledDate.toISOString())
      }
      formData.append('custom_message', data.customMessage)

      const result = await createGiftCampaign(formData)

      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const recipientCount = data.recipientType === 'ALL' 
    ? 'All Employees' 
    : `${data.selectedRecipients.length} Selected Employee${data.selectedRecipients.length !== 1 ? 's' : ''}`

  const totalBudget = data.perRecipientBudget && data.selectedRecipients.length > 0
    ? data.perRecipientBudget * data.selectedRecipients.length
    : data.budget || 0

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Review & Send</h3>
        <p className="text-sm text-muted-foreground">
          Review all details before sending your campaign. You can go back to make changes.
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {/* Campaign Details */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium text-foreground">Name:</span>
              <span className="text-sm text-muted-foreground ml-2">{data.name}</span>
            </div>
            {data.description && (
              <div>
                <span className="text-sm font-medium text-foreground">Description:</span>
                <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recipients */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recipients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-foreground">{recipientCount}</div>
            {data.recipientType === 'SELECTED' && employees.length > 0 && (
              <div className="mt-2 space-y-1 max-h-[150px] overflow-y-auto">
                {employees.slice(0, 10).map((emp) => (
                  <div key={emp.id} className="text-xs text-muted-foreground">
                    • {emp.name || emp.email}
                  </div>
                ))}
                {employees.length > 10 && (
                  <div className="text-xs text-muted-foreground">
                    ... and {employees.length - 10} more
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gifts */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Gifts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-foreground">
              Type: {
                data.giftType === 'SINGLE' ? 'Single Product' :
                data.giftType === 'CATALOG' ? 'Gift Catalog' :
                'Budget-Based'
              }
            </div>
            {data.giftType === 'SINGLE' && products.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {products[0].name} - ${products[0].price}
              </div>
            )}
            {data.giftType === 'CATALOG' && products.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {products.length} product{products.length !== 1 ? 's' : ''} in catalog
              </div>
            )}
            {data.giftType === 'BUDGET' && (
              <div className="text-sm text-muted-foreground">
                Recipients choose within their budget
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget */}
        {(data.budget || data.perRecipientBudget) && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {data.perRecipientBudget && (
                <div className="text-sm text-foreground">
                  Per Recipient: ${data.perRecipientBudget.toFixed(2)}
                </div>
              )}
              {data.budget && (
                <div className="text-sm text-foreground">
                  Total Budget: ${data.budget.toFixed(2)}
                </div>
              )}
              {totalBudget > 0 && (
                <div className="text-sm font-medium text-foreground mt-2">
                  Estimated Total: ${totalBudget.toFixed(2)}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Schedule */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-foreground">
              {data.scheduleType === 'NOW' 
                ? 'Send Immediately' 
                : data.scheduledDate 
                  ? `Scheduled for ${format(data.scheduledDate, "PPP 'at' p")}`
                  : 'Not scheduled'
              }
            </div>
          </CardContent>
        </Card>

        {/* Custom Message */}
        {data.customMessage && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Custom Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{data.customMessage}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="border-border/50"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {data.scheduleType === 'NOW' ? 'Sending...' : 'Creating...'}
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              {data.scheduleType === 'NOW' ? 'Send Campaign' : 'Schedule Campaign'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
