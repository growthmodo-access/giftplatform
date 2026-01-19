'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { inviteEmployee, importEmployeesFromCSV } from '@/actions/employees'
import { getCompanies } from '@/actions/companies'
import { Loader2, Upload, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AddEmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [csvLoading, setCsvLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('single')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [companies, setCompanies] = useState<Array<{id: string, name: string}>>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('')
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadUserAndCompanies()
    }
  }, [open])

  const loadUserAndCompanies = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: currentUser } = await supabase
        .from('users')
        .select('role, company_id')
        .eq('id', user.id)
        .single()

      if (currentUser) {
        setUserRole(currentUser.role)
        setUserCompanyId(currentUser.company_id)
        
        // If SUPER_ADMIN, load all companies
        if (currentUser.role === 'SUPER_ADMIN') {
          const result = await getCompanies()
          if (result.data) {
            setCompanies(result.data.map(c => ({ id: c.id, name: c.name })))
          }
        } else if (currentUser.company_id) {
          // For other roles, set their company
          setSelectedCompanyId(currentUser.company_id)
          setCompanies([{ id: currentUser.company_id, name: 'Your Company' }])
        }
      }
    } catch (err) {
      console.error('Error loading companies:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    
    // Get role from hidden input
    const roleValue = (document.getElementById('role-value') as HTMLInputElement)?.value
    
    if (!roleValue) {
      setError('Please select a role')
      setLoading(false)
      return
    }

    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const shippingAddress = formData.get('shipping_address') as string
    
    // Determine company_id: SUPER_ADMIN can select, others use their own
    const companyId = userRole === 'SUPER_ADMIN' && selectedCompanyId 
      ? selectedCompanyId 
      : userCompanyId

    const result = await inviteEmployee(
      email,
      name,
      roleValue as 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE',
      shippingAddress || null,
      companyId || null
    )

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(result.message || 'Employee invited successfully!')
      setTimeout(() => {
        onOpenChange(false)
        router.refresh()
        e.currentTarget.reset()
        setSuccess('')
      }, 2000)
    }
  }

  const handleCSVUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!csvFile) {
      setError('Please select a CSV file')
      return
    }

    setCsvLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('csv', csvFile)

      const result = await importEmployeesFromCSV(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(result.message || `Successfully imported ${result.count || 0} employees!`)
        setCsvFile(null)
        setTimeout(() => {
          onOpenChange(false)
          router.refresh()
          setSuccess('')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import CSV')
    } finally {
      setCsvLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Add a single employee or import multiple employees from CSV
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Employee</TabsTrigger>
            <TabsTrigger value="csv">CSV Import</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
                {success}
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="employee@company.com"
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            {userRole === 'SUPER_ADMIN' && companies.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="company">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Select 
                  required 
                  disabled={loading}
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                >
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <input type="hidden" name="role" id="role-value" />
              <Select 
                required 
                disabled={loading}
                onValueChange={(value) => {
                  const hiddenInput = document.getElementById('role-value') as HTMLInputElement
                  if (hiddenInput) hiddenInput.value = value
                }}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shipping_address">
                Shipping Address
              </Label>
              <Textarea
                id="shipping_address"
                name="shipping_address"
                placeholder="Street, City, State, ZIP, Country"
                disabled={loading}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Invite Employee
            </Button>
          </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            <form onSubmit={handleCSVUpload}>
              <div className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
                    {success}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="csv-file">CSV File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      disabled={csvLoading}
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    CSV format: email, name, role, shipping_address (optional)
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-md">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="font-medium">CSV Format Example:</p>
                      <pre className="mt-2 text-[10px] bg-background p-2 rounded border border-border/50">
{`email,name,role,shipping_address
john@company.com,John Doe,EMPLOYEE,"123 Main St, City, State, 12345"
jane@company.com,Jane Smith,MANAGER,"456 Oak Ave, City, State, 67890"`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={csvLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={csvLoading || !csvFile}>
                  {csvLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
