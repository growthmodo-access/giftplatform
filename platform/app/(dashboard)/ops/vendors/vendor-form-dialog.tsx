'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createVendor } from '@/actions/vendors'
import { useRouter } from 'next/navigation'

export function VendorFormDialog({
  trigger,
  vendor,
}: {
  trigger: React.ReactNode
  vendor?: { id: string; name: string; email: string; contact_phone?: string | null; gstin?: string | null; sla_days?: number; is_active?: boolean }
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const formData = new FormData(form)
    const result = vendor
      ? await import('@/actions/vendors').then((a) => a.updateVendor(vendor.id, formData))
      : await createVendor(formData)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    setOpen(false)
    router.refresh()
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-border/50">
        <DialogHeader>
          <DialogTitle>{vendor ? 'Edit vendor' : 'Add vendor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={vendor?.name} required className="mt-1 border-border/50" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={vendor?.email} required className="mt-1 border-border/50" />
          </div>
          <div>
            <Label htmlFor="contact_phone">Phone</Label>
            <Input id="contact_phone" name="contact_phone" defaultValue={vendor?.contact_phone ?? ''} className="mt-1 border-border/50" />
          </div>
          <div>
            <Label htmlFor="gstin">GSTIN</Label>
            <Input id="gstin" name="gstin" defaultValue={vendor?.gstin ?? ''} className="mt-1 border-border/50" />
          </div>
          <div>
            <Label htmlFor="sla_days">SLA (days)</Label>
            <Input id="sla_days" name="sla_days" type="number" min={1} defaultValue={vendor?.sla_days ?? 7} className="mt-1 border-border/50" />
          </div>
          {vendor && (
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_active" name="is_active" value="true" defaultChecked={vendor?.is_active !== false} className="rounded border-border" />
              <Label htmlFor="is_active">Active</Label>
            </div>
          )}
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
