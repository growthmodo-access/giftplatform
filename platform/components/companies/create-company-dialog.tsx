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
import { createCompany } from '@/actions/companies'

interface CreateCompanyDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateCompanyDialog({ open, onClose, onSuccess }: CreateCompanyDialogProps) {
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [budget, setBudget] = useState('')
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

      const result = await createCompany(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // Reset form
        setName('')
        setDomain('')
        setBudget('')
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
