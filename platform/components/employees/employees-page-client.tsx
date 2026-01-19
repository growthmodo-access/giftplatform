'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { Plus } from 'lucide-react'
import { EmployeesList } from './employees-list'
import { AddEmployeeDialog } from './add-employee-dialog'
import { TeamsSection } from './teams-section'

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

const ITEMS_PER_PAGE = 10

export function EmployeesPageClient({ employees, currentUserRole, currentUserId }: EmployeesPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const canInviteEmployees = currentUserRole === 'ADMIN' || currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN'

  // Paginate employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return employees.slice(startIndex, endIndex)
  }, [employees, currentPage])

  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE)

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Manage your team members</p>
        </div>
        {canInviteEmployees && (
          <Button 
            size="sm"
            className="gap-2 text-xs sm:text-sm w-full sm:w-auto" 
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Teams Section - Only for ADMIN, HR, SUPER_ADMIN */}
      {(currentUserRole === 'ADMIN' || currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN') && (
        <TeamsSection currentUserRole={currentUserRole} />
      )}

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg lg:text-xl">All Employees</CardTitle>
          <CardDescription className="text-sm">View and manage team members</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeesList 
            employees={paginatedEmployees} 
            currentUserRole={currentUserRole}
            currentUserId={currentUserId}
          />
          
          {/* Pagination */}
          {employees.length > ITEMS_PER_PAGE && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={employees.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AddEmployeeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
