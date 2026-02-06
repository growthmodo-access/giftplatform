'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { assignVendorToOrder } from '@/actions/vendors'
import { useRouter } from 'next/navigation'
import { Truck } from 'lucide-react'

type Vendor = { id: string; name: string }

export function AssignVendorButton({
  orderId,
  orderNumber,
  vendors,
}: {
  orderId: string
  orderNumber: string
  vendors: Vendor[]
}) {
  const [open, setOpen] = useState(false)
  const [vendorId, setVendorId] = useState('')
  const [cost, setCost] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendorId) return
    setLoading(true)
    setError('')
    const result = await assignVendorToOrder(
      orderId,
      vendorId,
      cost ? parseFloat(cost) : undefined
    )
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setOpen(false)
    setVendorId('')
    setCost('')
    router.refresh()
  }

  if (!vendors.length) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-border/50">
          <Truck className="w-4 h-4 mr-1" /> Assign vendor
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/50">
        <DialogHeader>
          <DialogTitle>Assign vendor to {orderNumber}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Label htmlFor="vendor_id">Vendor</Label>
            <select
              id="vendor_id"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
              className="mt-1 w-full h-9 rounded-md border border-border/50 bg-background px-2 text-sm"
            >
              <option value="">Select...</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="cost">Cost (optional)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1 border-border/50"
            />
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Assigning...' : 'Assign'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
