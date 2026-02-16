'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { inviteEmployee } from '@/actions/employees'
import { getCompanies } from '@/actions/companies'
import { Loader2 } from 'lucide-react'

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [role, setRole] = useState<'SUPER_ADMIN' | 'HR' | 'EMPLOYEE'>('EMPLOYEE')

  useEffect(() => {
    if (open) {
      setError('')
      setEmail('')
      setName('')
      setCompanyId('')
      setRole('EMPLOYEE')
      getCompanies().then((res) => {
        if (res.data?.length) {
          setCompanies(res.data.map((c) => ({ id: c.id, name: c.name })))
          setCompanyId(res.data[0].id)
        }
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !companyId) {
      setError('Email and company are required.')
      return
    }
    setLoading(true)
    setError('')
    const result = await inviteEmployee(
      email.trim(),
      (name || email).trim(),
      role,
      undefined,
      companyId
    )
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    toast({ variant: 'success', title: 'User added', description: 'Invitation sent. They can set their password via the email link.' })
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] border-border/50">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>
            Create a user and assign them to a company and role. They will receive an email to set their password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="add-user-email">Email *</Label>
            <Input
              id="add-user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.com"
              required
              className="border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-user-name">Name</Label>
            <Input
              id="add-user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Company *</Label>
            <Select value={companyId} onValueChange={setCompanyId} required>
              <SelectTrigger className="border-border/50">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Role *</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger className="border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="HR">Company HR</SelectItem>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
