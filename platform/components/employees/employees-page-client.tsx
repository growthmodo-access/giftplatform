'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { EmployeesList } from './employees-list'
import { AddEmployeeDialog } from './add-employee-dialog'

type Employee = {
  id: string
  email: string
  name: string | null
  role: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
  avatar: string | null
  giftsCount: number
}

interface EmployeesPageClientProps {
  employees: Employee[]
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
  currentUserId: string
}

export function EmployeesPageClient({ employees, currentUserRole, currentUserId }: EmployeesPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const canInviteEmployees = currentUserRole === 'ADMIN' || currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN'
  
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/employees/employees-page-client.tsx:27',message:'EmployeesPageClient render',data:{currentUserRole,canInviteEmployees},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  }
  // #endregion

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
          {/* Debug: Show current role */}
          <p className="text-xs text-gray-400 mt-1">Your role: {currentUserRole} | Can invite: {canInviteEmployees ? 'Yes' : 'No'}</p>
        </div>
        <Button 
          className="gap-2" 
          onClick={() => setDialogOpen(true)}
          disabled={!canInviteEmployees}
          title={!canInviteEmployees ? 'You need ADMIN, HR, or SUPER_ADMIN role to invite employees' : undefined}
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>View and manage team members</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeesList 
            employees={employees} 
            currentUserRole={currentUserRole}
            currentUserId={currentUserId}
          />
        </CardContent>
      </Card>

      <AddEmployeeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
