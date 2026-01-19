'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCompany } from '@/actions/companies'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'SGD', 'HKD', 'NZD', 'ZAR', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK']

interface CreateCompanyDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateCompanyDialog({ open, onClose, onSuccess }: CreateCompanyDialogProps) {
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [budget, setBudget] = useState('')
  const [taxId, setTaxId] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [billingStreet, setBillingStreet] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingState, setBillingState] = useState('')
  const [billingCountry, setBillingCountry] = useState('')
  const [billingZip, setBillingZip] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('domain', domain)
      formData.append('budget', budget)
      formData.append('tax_id', taxId)
      formData.append('currency', currency)
      formData.append('billing_address', JSON.stringify({
        street: billingStreet,
        city: billingCity,
        state: billingState,
        country: billingCountry,
        zip_code: billingZip,
      }))

      const result = await createCompany(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // Reset form
        setName('')
        setDomain('')
        setBudget('')
        setTaxId('')
        setCurrency('USD')
        setBillingStreet('')
        setBillingCity('')
        setBillingState('')
        setBillingCountry('')
        setBillingZip('')
        onSuccess()
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setName('')
      setDomain('')
      setBudget('')
      setTaxId('')
      setCurrency('USD')
      setBillingStreet('')
      setBillingCity('')
      setBillingState('')
      setBillingCountry('')
      setBillingZip('')
      setError('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Company</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new company to the platform
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md mb-4">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Company Name *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-border/50"
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-foreground">Domain</Label>
              <Input
                id="domain"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="border-border/50"
                placeholder="acme.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-foreground">Monthly Budget *</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                className="border-border/50"
                placeholder="10000"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-foreground">Currency *</Label>
              <Select value={currency} onValueChange={setCurrency} required>
                <SelectTrigger className="border-border/50">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_id" className="text-foreground">Tax ID</Label>
              <Input
                id="tax_id"
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="border-border/50"
                placeholder="TAX-123456"
              />
            </div>
            <div className="space-y-4 pt-2 border-t border-border/50">
              <h3 className="text-sm font-semibold text-foreground">Billing Address</h3>
              <div className="space-y-2">
                <Label htmlFor="billing_street" className="text-foreground">Street Address</Label>
                <Input
                  id="billing_street"
                  type="text"
                  value={billingStreet}
                  onChange={(e) => setBillingStreet(e.target.value)}
                  className="border-border/50"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="billing_city" className="text-foreground">City</Label>
                  <Input
                    id="billing_city"
                    type="text"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    className="border-border/50"
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing_state" className="text-foreground">State/Province</Label>
                  <Input
                    id="billing_state"
                    type="text"
                    value={billingState}
                    onChange={(e) => setBillingState(e.target.value)}
                    className="border-border/50"
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="billing_country" className="text-foreground">Country</Label>
                  <Input
                    id="billing_country"
                    type="text"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                    className="border-border/50"
                    placeholder="United States"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing_zip" className="text-foreground">ZIP/Postal Code</Label>
                  <Input
                    id="billing_zip"
                    type="text"
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                    className="border-border/50"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading} className="border-border/50">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Company'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
