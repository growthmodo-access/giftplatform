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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>
        {canInviteEmployees && (
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        )}
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

      {canInviteEmployees && (
        <AddEmployeeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </div>
  )
}
