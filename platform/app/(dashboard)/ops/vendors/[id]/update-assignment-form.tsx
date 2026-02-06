'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateVendorAssignment } from '@/actions/vendors'
import { useRouter } from 'next/navigation'

const STATUSES = ['PENDING', 'ACCEPTED', 'SHIPPED', 'DELIVERED'] as const

export function UpdateAssignmentForm({
  assignmentId,
  currentStatus,
  currentTracking,
}: {
  assignmentId: string
  currentStatus: string
  currentTracking: string | null
}) {
  const [status, setStatus] = useState(currentStatus)
  const [tracking, setTracking] = useState(currentTracking ?? '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await updateVendorAssignment(assignmentId, {
      status,
      tracking_number: tracking.trim() || undefined,
    })
    setLoading(false)
    if (result.error) return
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div className="space-y-1">
        <Label className="text-xs">Status</Label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 rounded-md border border-border/50 bg-background px-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Tracking</Label>
        <Input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Tracking number"
          className="h-9 w-40 border-border/50 text-sm"
        />
      </div>
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? 'Updating...' : 'Update'}
      </Button>
    </form>
  )
}
