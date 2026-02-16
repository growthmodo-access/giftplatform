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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Truck, Package, Building2, User, MapPin } from 'lucide-react'
import { updateOrderTracking } from '@/actions/orders'

type Order = {
  id: string
  orderNumber: string
  employee: string
  employeeEmail?: string
  product: string
  amount: string
  status: string
  date: string
  company?: string
  companyId?: string | null
  shippingAddress?: string | null
  trackingNumber?: string | null
}

interface OrderDetailsDialogProps {
  order: Order | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
  canEdit: boolean
}

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export function OrderDetailsDialog({ order, open, onClose, onSuccess, canEdit }: OrderDetailsDialogProps) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [status, setStatus] = useState('PENDING')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (order && open) {
      setTrackingNumber(order.trackingNumber || '')
      setStatus(order.status || 'PENDING')
      setError('')
    }
  }, [order, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order || !canEdit) return

    setLoading(true)
    setError('')

    try {
      const result = await updateOrderTracking(order.id, {
        trackingNumber: trackingNumber.trim() || null,
        status: status as any,
      })

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

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">Order Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Order #{order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          {/* Order Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Employee</Label>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{order.employee}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Company</Label>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{order.company || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Product</Label>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{order.product}</span>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">Shipping Address</Label>
                <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">
                    {(() => {
                      try {
                        const addr = JSON.parse(order.shippingAddress as string)
                        if (addr && typeof addr === 'object' && (addr.street || addr.city || addr.country || addr.zip_code)) {
                          return [addr.street, [addr.city, addr.zip_code].filter(Boolean).join(' '), addr.country].filter(Boolean).join(', ')
                        }
                      } catch {
                        // not JSON, show as-is
                      }
                      return order.shippingAddress
                    })()}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-muted-foreground">Amount</Label>
              <div className="p-2 bg-muted/50 rounded-md">
                <span className="text-sm font-semibold text-foreground">{order.amount}</span>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          {canEdit && (
            <div className="space-y-4 border-t border-border/50 pt-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-foreground">Order Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tracking" className="text-foreground">Tracking Number</Label>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="tracking"
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="border-border/50"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Add tracking number when order is shipped
                </p>
              </div>
            </div>
          )}

          {/* Read-only tracking display */}
          {!canEdit && order.trackingNumber && (
            <div className="space-y-2 border-t border-border/50 pt-4">
              <Label className="text-muted-foreground">Tracking Number</Label>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-mono text-foreground">{order.trackingNumber}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="border-border/50">
              Close
            </Button>
            {canEdit && (
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
