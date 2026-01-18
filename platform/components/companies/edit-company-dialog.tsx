'use client'

import { useState, useEffect } from 'react'
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

export function EditCompanyDialog({ company, open, onClose, onSuccess }: EditCompanyDialogProps) {
  const [name, setName] = useState(company.name)
  const [domain, setDomain] = useState(company.domain || '')
  const [budget, setBudget] = useState(company.budget.toString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setName(company.name)
      setDomain(company.domain || '')
      setBudget(company.budget.toString())
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
      formData.append('budget', budget)

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
              <Label htmlFor="budget" className="text-foreground">Monthly Budget</Label>
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
