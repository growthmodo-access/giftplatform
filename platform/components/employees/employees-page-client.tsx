'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { Plus, Search } from 'lucide-react'
import type { AppRole } from '@/lib/roles'
import { EmployeesList } from './employees-list'
import { AddEmployeeDialog } from './add-employee-dialog'
import { TeamsSection } from './teams-section'

type Employee = {
  id: string
  email: string
  name: string | null
  role: string
  avatar: string | null
  giftsCount: number
}

interface EmployeesPageClientProps {
  employees: Employee[]
  currentUserRole: AppRole
  currentUserId: string
}

const ITEMS_PER_PAGE = 10

export function EmployeesPageClient({ employees, currentUserRole, currentUserId }: EmployeesPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const canInviteEmployees = currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN'

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees
    const q = search.trim().toLowerCase()
    return employees.filter(
      (e) =>
        (e.name || '').toLowerCase().includes(q) ||
        (e.email || '').toLowerCase().includes(q)
    )
  }, [employees, search])

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredEmployees, currentPage])

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your team members</p>
        </div>
        {canInviteEmployees && (
          <Button size="sm" className="gap-2 w-full sm:w-auto" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        )}
      </div>

      {(currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN') && (
        <TeamsSection currentUserRole={currentUserRole} />
      )}

      <Card className="rounded-xl border border-border/40 bg-white shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">All Employees</CardTitle>
              <CardDescription className="text-sm">View and manage team members</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 h-9 text-sm border-border/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmployeesList
            employees={paginatedEmployees}
            currentUserRole={currentUserRole}
            currentUserId={currentUserId}
          />

          {filteredEmployees.length > ITEMS_PER_PAGE && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredEmployees.length}
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
