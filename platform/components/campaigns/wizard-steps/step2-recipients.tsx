'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getEmployees } from '@/actions/employees'
import { CampaignWizardData } from '../campaign-wizard'
import { AddEmployeeDialog } from '@/components/employees/add-employee-dialog'

interface Step2Props {
  data: CampaignWizardData
  onUpdate: (data: Partial<CampaignWizardData>) => void
}

export function CampaignStep2Recipients({ data, onUpdate }: Step2Props) {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddEmployee, setShowAddEmployee] = useState(false)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    setLoading(true)
    const result = await getEmployees()
    if (result.data) {
      setEmployees(result.data)
    }
    setLoading(false)
  }

  const handleRecipientToggle = (employeeId: string) => {
    const current = data.selectedRecipients || []
    const updated = current.includes(employeeId)
      ? current.filter((id: string) => id !== employeeId)
      : [...current, employeeId]
    onUpdate({ selectedRecipients: updated })
  }

  const handleSelectAll = () => {
    if (data.selectedRecipients.length === filteredEmployees.length) {
      onUpdate({ selectedRecipients: [] })
    } else {
      onUpdate({ selectedRecipients: filteredEmployees.map(e => e.id) })
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchQuery.toLowerCase()
    return (
      employee.name?.toLowerCase().includes(searchLower) ||
      employee.email?.toLowerCase().includes(searchLower)
    )
  })

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email[0]?.toUpperCase() || 'U'
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Select Recipients</h3>
        <p className="text-sm text-muted-foreground">
          Choose who should receive gifts from this campaign.
        </p>
      </div>

      <RadioGroup
        value={data.recipientType}
        onValueChange={(value) => {
          onUpdate({ 
            recipientType: value as 'ALL' | 'SELECTED',
            selectedRecipients: value === 'ALL' ? [] : data.selectedRecipients
          })
        }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="ALL" id="all" />
          <Label htmlFor="all" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">All Employees</div>
            <div className="text-sm text-muted-foreground">Send to everyone in your company</div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="SELECTED" id="selected" />
          <Label htmlFor="selected" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">Select Specific Employees</div>
            <div className="text-sm text-muted-foreground">Choose individual employees to receive gifts</div>
          </Label>
        </div>
      </RadioGroup>

      {data.recipientType === 'SELECTED' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-border/50"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddEmployee(true)}
              className="border-border/50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>

          {filteredEmployees.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {data.selectedRecipients.length} of {filteredEmployees.length} selected
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {data.selectedRecipients.length === filteredEmployees.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          )}

          <ScrollArea className="h-[300px] border border-border/50 rounded-md p-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">Loading employees...</div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery ? 'No employees found matching your search' : 'No employees found'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleRecipientToggle(employee.id)}
                  >
                    <Checkbox
                      id={employee.id}
                      checked={data.selectedRecipients?.includes(employee.id)}
                      onCheckedChange={() => handleRecipientToggle(employee.id)}
                    />
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-foreground text-background">
                        {getInitials(employee.name, employee.email)}
                      </AvatarFallback>
                    </Avatar>
                    <Label htmlFor={employee.id} className="flex-1 cursor-pointer">
                      <div className="font-medium text-foreground">
                        {employee.name || employee.email}
                      </div>
                      {employee.name && (
                        <div className="text-xs text-muted-foreground">{employee.email}</div>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {showAddEmployee && (
        <AddEmployeeDialog
          open={showAddEmployee}
          onOpenChange={(open) => {
            setShowAddEmployee(open)
            if (!open) {
              // Refresh employees list after adding
              loadEmployees()
            }
          }}
        />
      )}
    </div>
  )
}
