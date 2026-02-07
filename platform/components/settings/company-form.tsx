'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateCompanyInfo } from '@/actions/profile'
import { useRouter } from 'next/navigation'

interface CompanyFormProps {
  initialName: string | null
  initialDomain: string | null
  initialBudget: number | null
  initialCurrency: string | null
  canEdit: boolean
}

export function CompanyForm({ initialName, initialDomain, initialBudget, initialCurrency, canEdit }: CompanyFormProps) {
  const router = useRouter()
  const [companyName, setCompanyName] = useState(initialName || '')
  const [domain, setDomain] = useState(initialDomain || '')
  const [budget, setBudget] = useState(initialBudget?.toString() || '')
  const [currency, setCurrency] = useState(initialCurrency || 'INR')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canEdit) {
      setError('You do not have permission to update company information')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('companyName', companyName)
      formData.append('domain', domain)
      formData.append('budget', budget)
      formData.append('currency', currency)

      const result = await updateCompanyInfo(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!canEdit) {
    return (
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Company Information</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Company details (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Company Name</Label>
            <div className="text-sm text-foreground">{initialName || 'Not set'}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Domain</Label>
            <div className="text-sm text-foreground">{initialDomain || 'Not set'}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Budget</Label>
            <div className="text-sm text-foreground">
              {initialBudget != null ? `${(initialCurrency === 'INR' ? '₹' : '$')}${initialBudget.toLocaleString()}` : 'Not set'}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Default currency</Label>
            <div className="text-sm text-foreground">{initialCurrency || 'INR'}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border border-border/40 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Company Information</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Update your company details and default currency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-foreground bg-muted border border-border/50 rounded-md">
              Company information updated successfully
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-foreground">Company Name</Label>
            <Input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
            <Label htmlFor="currency" className="text-foreground">Default currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency" className="border-border/50">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-foreground">Monthly Budget</Label>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="border-border/50"
              placeholder="10000"
              min="0"
              step="0.01"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
