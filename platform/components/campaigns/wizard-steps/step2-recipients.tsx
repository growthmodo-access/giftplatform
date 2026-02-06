'use client'

import { useState, useEffect, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Plus, Search, Upload, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getEmployees } from '@/actions/employees'
import { getTeams } from '@/actions/teams'
import { CampaignWizardData, CsvRecipientRow } from '../campaign-wizard'
import { AddEmployeeDialog } from '@/components/employees/add-employee-dialog'
import { parseRecipientsCsv } from '@/lib/parse-recipients-csv'

interface Step2Props {
  data: CampaignWizardData
  onUpdate: (data: Partial<CampaignWizardData>) => void
}

export function CampaignStep2Recipients({ data, onUpdate }: Step2Props) {
  const [employees, setEmployees] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [csvError, setCsvError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadEmployees()
    loadTeams()
  }, [])

  const loadEmployees = async () => {
    setLoading(true)
    const result = await getEmployees()
    if (result.data) {
      setEmployees(result.data)
    }
    setLoading(false)
  }

  const loadTeams = async () => {
    const result = await getTeams()
    if (result.data) {
      setTeams(result.data)
    }
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

  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setCsvError('')
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? '')
      const { rows, error } = parseRecipientsCsv(text)
      if (error) {
        setCsvError(error)
        onUpdate({ csvRows: [] })
        return
      }
      onUpdate({ csvRows: rows })
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Select Recipients</h3>
        <p className="text-sm text-muted-foreground mb-1">
          Choose who should receive gifts from this campaign.
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Upload CSV</strong> = we’ll email each person a personal link to choose their gift. <strong>Employees</strong> = people already in your company will see the campaign in the app.
        </p>
      </div>

      <RadioGroup
        value={data.recipientSource === 'CSV' ? 'CSV' : data.recipientType}
        onValueChange={(value) => {
          if (value === 'CSV') {
            onUpdate({ recipientSource: 'CSV', csvRows: data.csvRows })
          } else {
            onUpdate({
              recipientSource: 'EMPLOYEES',
              recipientType: value as 'ALL' | 'SELECTED' | 'TEAM',
              selectedRecipients: value === 'ALL' ? [] : data.selectedRecipients,
              selectedTeams: value === 'ALL' ? [] : (data.selectedTeams || []),
            })
          }
        }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="CSV" id="csv" />
          <Label htmlFor="csv" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">Upload CSV (email gift links)</div>
            <div className="text-sm text-muted-foreground">Upload a list (name, email, designation, department, phone). We’ll email each recipient a personal link to choose their gift.</div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="ALL" id="all" />
          <Label htmlFor="all" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">All Employees (in app)</div>
            <div className="text-sm text-muted-foreground">Send to everyone in your company; they’ll see the campaign in the app.</div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="TEAM" id="team" />
          <Label htmlFor="team" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">Select Teams (in app)</div>
            <div className="text-sm text-muted-foreground">Send to specific teams; they’ll see the campaign in the app.</div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="SELECTED" id="selected" />
          <Label htmlFor="selected" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">Select Specific Employees (in app)</div>
            <div className="text-sm text-muted-foreground">Choose individual employees; they’ll see the campaign in the app.</div>
          </Label>
        </div>
      </RadioGroup>

      {data.recipientSource === 'CSV' && (
        <div className="space-y-4 pt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleCsvFile}
          />
          <Button
            type="button"
            variant="outline"
            className="border-border/50"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose CSV file
          </Button>
          <p className="text-xs text-muted-foreground">
            CSV must have columns: name, email (optional: designation, department, phone).
          </p>
          {csvError && (
            <p className="text-sm text-destructive">{csvError}</p>
          )}
          {data.csvRows.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <FileText className="w-4 h-4" />
                {data.csvRows.length} recipient{data.csvRows.length !== 1 ? 's' : ''} loaded
              </div>
              <ScrollArea className="h-[200px] border border-border/50 rounded-md p-2">
                <div className="space-y-1">
                  {data.csvRows.slice(0, 50).map((row, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      {row.name || row.email} &lt;{row.email}&gt;
                    </div>
                  ))}
                  {data.csvRows.length > 50 && (
                    <div className="text-xs text-muted-foreground">... and {data.csvRows.length - 50} more</div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/50">
            <div className="space-y-2">
              <Label className="text-foreground">Link valid until</Label>
              <Input
                type="date"
                value={data.linkValidUntil ? new Date(data.linkValidUntil).toISOString().slice(0, 10) : ''}
                onChange={(e) => {
                  const v = e.target.value
                  onUpdate({ linkValidUntil: v ? new Date(v + 'T23:59:59') : null })
                }}
                className="border-border/50"
              />
              <p className="text-xs text-muted-foreground">Leave empty for no expiry.</p>
            </div>
            <div className="flex items-center gap-2 pt-8">
              <Checkbox
                id="allow_edit"
                checked={data.allowEditWhenLive}
                onCheckedChange={(checked) => onUpdate({ allowEditWhenLive: !!checked })}
              />
              <Label htmlFor="allow_edit" className="text-sm cursor-pointer">Allow editing campaign when live</Label>
            </div>
          </div>
        </div>
      )}

      {data.recipientSource === 'EMPLOYEES' && data.recipientType === 'SELECTED' && (
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
