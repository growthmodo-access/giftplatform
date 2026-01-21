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
import { useToast } from '@/hooks/use-toast'
import { updateEmployeeRole } from '@/actions/employees'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MoreVertical, Building2, MapPin } from 'lucide-react'

type Employee = {
  id: string
  email: string
  name: string | null
  role: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
  avatar: string | null
  giftsCount: number
  companyName?: string | null
  shippingAddress?: {
    street: string
    city: string
    state?: string | null
    country: string
    zip_code: string
  } | null
}

interface EmployeesListProps {
  employees: Employee[]
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
  currentUserId: string
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-blue-100 text-blue-700',
  HR: 'bg-pink-100 text-pink-700',
  MANAGER: 'bg-green-100 text-green-700',
  EMPLOYEE: 'bg-gray-100 text-gray-700',
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  HR: 'HR',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
}

export function EmployeesList({ employees, currentUserRole, currentUserId }: EmployeesListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [updating, setUpdating] = useState<string | null>(null)

  const canManageRoles = currentUserRole === 'ADMIN' || currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN'

  const handleRoleChange = async (userId: string, newRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') => {
    setUpdating(userId)
    const result = await updateEmployeeRole(userId, newRole)
    setUpdating(null)
    
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      toast({
        variant: "success",
        title: "Role Updated",
        description: `Employee role updated to ${roleLabels[newRole]}.`,
      })
      router.refresh()
    }
  }

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="mb-4 p-4 rounded-full bg-muted/50">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No employees found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Add your first team member to get started with employee management.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 lg:space-y-4">
      {employees.map((employee) => {
        const isCurrentUser = employee.id === currentUserId
        const initials = employee.name
          ? employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          : employee.email[0].toUpperCase()

        return (
          <div
            key={employee.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors gap-3 sm:gap-4 bg-card"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <AvatarFallback className="text-sm sm:text-base">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground text-sm sm:text-base truncate">
                    {employee.name || 'No name'}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                    )}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground truncate">{employee.email}</p>
                {employee.companyName && (
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{employee.companyName}</p>
                  </div>
                )}
                {employee.shippingAddress && (
                  <div className="flex items-start gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {employee.shippingAddress.street}, {employee.shippingAddress.city}{employee.shippingAddress.state ? `, ${employee.shippingAddress.state}` : ''} {employee.shippingAddress.zip_code}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="text-left sm:text-right">
                <Badge className={`text-xs ${roleColors[employee.role] || roleColors.EMPLOYEE}`}>
                  {roleLabels[employee.role] || 'Employee'}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{employee.giftsCount} gifts sent</p>
              </div>
              {canManageRoles && !isCurrentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={updating === employee.id}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(employee.id, 'ADMIN')}
                      disabled={employee.role === 'ADMIN' || updating === employee.id}
                      className="text-xs sm:text-sm"
                    >
                      Set as Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(employee.id, 'HR')}
                      disabled={employee.role === 'HR' || updating === employee.id}
                      className="text-xs sm:text-sm"
                    >
                      Set as HR
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(employee.id, 'MANAGER')}
                      disabled={employee.role === 'MANAGER' || updating === employee.id}
                      className="text-xs sm:text-sm"
                    >
                      Set as Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(employee.id, 'EMPLOYEE')}
                      disabled={employee.role === 'EMPLOYEE' || updating === employee.id}
                      className="text-xs sm:text-sm"
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
