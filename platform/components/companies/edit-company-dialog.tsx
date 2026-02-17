'use client'

import { useState, useEffect, useRef } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { updateCompany } from '@/actions/companies'

interface Company {
  id: string
  name: string
  domain: string | null
  budget: number
  logo: string | null
  created_at: string
  updated_at: string
  employeeCount: number
  orderCount: number
  revenue: number
}

interface EditCompanyDialogProps {
  company: Company
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'BRL', 'MXN', 'SGD', 'HKD', 'NZD', 'ZAR', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK']

export function EditCompanyDialog({ company, open, onClose, onSuccess }: EditCompanyDialogProps) {
  const [name, setName] = useState(company.name)
  const [domain, setDomain] = useState(company.domain || '')
  const [logo, setLogo] = useState(company.logo || '')
  const [taxId, setTaxId] = useState((company as any).tax_id || '')
  const [currency, setCurrency] = useState((company as any).currency || 'INR')
  const [billingStreet, setBillingStreet] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingState, setBillingState] = useState('')
  const [billingCountry, setBillingCountry] = useState('')
  const [billingZip, setBillingZip] = useState('')
  const [primaryColor, setPrimaryColor] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const logoFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName(company.name)
      setDomain(company.domain || '')
      setLogo(company.logo || '')
      setTaxId((company as any).tax_id || '')
      setCurrency((company as any).currency || 'INR')
      const billing = (company as any).billing_address || {}
      setBillingStreet(billing.street || '')
      setBillingCity(billing.city || '')
      setBillingState(billing.state || '')
      setBillingCountry(billing.country || '')
      setBillingZip(billing.zip_code || '')
      setPrimaryColor((company as any).settings?.primaryColor || '')
      setError('')
    }
  }, [company, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('domain', domain)
      formData.append('logo', logo)
      const logoFile = logoFileRef.current?.files?.[0]
      if (logoFile) formData.append('logoFile', logoFile)
      formData.append('tax_id', taxId)
      formData.append('currency', currency)
      formData.append('billing_address', JSON.stringify({
        street: billingStreet,
        city: billingCity,
        state: billingState,
        country: billingCountry,
        zip_code: billingZip,
      }))
      formData.append('primary_color', primaryColor.trim())

      const result = await updateCompany(company.id, formData)

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Company</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update company information
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
              <Label htmlFor="name" className="text-foreground">Company Name</Label>
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
              <Label className="text-foreground">Brand logo</Label>
              <div className="flex flex-col gap-2">
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:text-sm"
                />
                <span className="text-xs text-muted-foreground">Or enter URL:</span>
                <Input
                  id="logo"
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="border-border/50"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used in company store and company profile. Upload an image or paste a URL.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-foreground">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
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
            <div className="space-y-2">
              <Label htmlFor="primary_color" className="text-foreground">Store theme color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="primary_color"
                  value={primaryColor || '#6366f1'}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-14 rounded border border-border/50 cursor-pointer"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 border-border/50 font-mono text-sm"
                  placeholder="#6366f1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used for company store header (leave empty for default)</p>
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
            <Button type="button" variant="outline" onClick={onClose} className="border-border/50">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
