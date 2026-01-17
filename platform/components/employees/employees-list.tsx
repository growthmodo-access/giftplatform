'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { updateEmployeeRole } from '@/actions/employees'
import { MoreVertical } from 'lucide-react'

type Employee = {
  id: string
  email: string
  name: string | null
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
  avatar: string | null
  giftsCount: number
}

interface EmployeesListProps {
  employees: Employee[]
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
  currentUserId: string
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-blue-100 text-blue-700',
  MANAGER: 'bg-green-100 text-green-700',
  EMPLOYEE: 'bg-gray-100 text-gray-700',
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
}

export function EmployeesList({ employees, currentUserRole, currentUserId }: EmployeesListProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)

  const canManageRoles = currentUserRole === 'ADMIN' || currentUserRole === 'SUPER_ADMIN'

  const handleRoleChange = async (userId: string, newRole: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE') => {
    setUpdating(userId)
    const result = await updateEmployeeRole(userId, newRole)
    setUpdating(null)
    
    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No employees found. Add your first team member to get started.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {employees.map((employee) => {
        const isCurrentUser = employee.id === currentUserId
        const initials = employee.name
          ? employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          : employee.email[0].toUpperCase()

        return (
          <div
            key={employee.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">
                    {employee.name || 'No name'}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-gray-500">(You)</span>
                    )}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <Badge className={roleColors[employee.role] || roleColors.EMPLOYEE}>
                  {roleLabels[employee.role] || 'Employee'}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">{employee.giftsCount} gifts sent</p>
              </div>
              {canManageRoles && !isCurrentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={updating === employee.id}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(employee.id, 'ADMIN')}
                      disabled={employee.role === 'ADMIN' || updating === employee.id}
                    >
                      Set as Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(employee.id, 'MANAGER')}
                      disabled={employee.role === 'MANAGER' || updating === employee.id}
                    >
                      Set as Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(employee.id, 'EMPLOYEE')}
                      disabled={employee.role === 'EMPLOYEE' || updating === employee.id}
                    >
                      Set as Employee
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
