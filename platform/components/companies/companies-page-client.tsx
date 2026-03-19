'use client'

import { useState } from 'react'
import { CompaniesTable } from './companies-table'
import { EditCompanyDialog } from './edit-company-dialog'
import { CreateCompanyDialog } from './create-company-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Plus } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { deleteCompany } from '@/actions/companies'

interface Company {
  id: string
  name: string
  domain: string | null
  budget: number
  logo: string | null
  created_at: string
  updated_at: string
  employeeCount: number
  orderCount: number
  revenue: number
}

import type { AppRole } from '@/lib/roles'

interface CompaniesPageClientProps {
  initialCompanies: Company[]
  currentUserRole: AppRole
}

export function CompaniesPageClient({ initialCompanies, currentUserRole }: CompaniesPageClientProps) {
  const [companies, setCompanies] = useState(initialCompanies)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null)
  const { toast } = useToast()

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setIsEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false)
    setEditingCompany(null)
  }

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false)
  }

  const handleUpdateSuccess = () => {
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleDeleteCompany = async () => {
    if (!deletingCompany) return
    const result = await deleteCompany(deletingCompany.id)
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      })
      return
    }
    toast({
      variant: 'success',
      title: 'Company Deleted',
      description: `${deletingCompany.name} has been deleted.`,
    })
    setDeletingCompany(null)
    window.location.reload()
  }

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN'
  const canCreate = currentUserRole === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Companies</h1>
          <p className="text-muted-foreground mt-1">
            {isSuperAdmin ? 'Manage all companies' : 'View your company information'}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Company
          </Button>
        )}
      </div>

      {companies.length === 0 ? (
        <Card className="border border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-lg bg-muted/50 mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No companies found</h3>
            <p className="text-sm text-muted-foreground">
              {isSuperAdmin 
                ? 'No companies have been created yet'
                : 'Your company information is not available'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          {isSuperAdmin && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Total Companies
                    </p>
                  </div>
                  <p className="text-3xl font-semibold text-foreground">{companies.length}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Total Employees
                    </p>
                  </div>
                  <p className="text-3xl font-semibold text-foreground">
                    {companies.reduce((sum, c) => sum + c.employeeCount, 0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Total Revenue
                    </p>
                  </div>
                  <p className="text-3xl font-semibold text-foreground">
                    ${(companies.reduce((sum, c) => sum + c.revenue, 0) / 1000).toFixed(1)}k
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <CompaniesTable 
            companies={companies} 
            onEdit={handleEdit}
            onDelete={(company) => setDeletingCompany(company)}
            canEdit={isSuperAdmin}
            canDelete={isSuperAdmin}
            showRevenue={isSuperAdmin}
          />
        </>
      )}

      {editingCompany && (
        <EditCompanyDialog
          company={editingCompany}
          open={isEditDialogOpen}
          onClose={handleEditDialogClose}
          onSuccess={handleUpdateSuccess}
          currentUserRole={currentUserRole}
        />
      )}

      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onClose={handleCreateDialogClose}
        onSuccess={handleUpdateSuccess}
      />

      {deletingCompany && (
        <AlertDialog open={!!deletingCompany} onOpenChange={(open) => !open && setDeletingCompany(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Company</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deletingCompany.name}? This cannot be undone and may remove related data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteCompany}
              >
                Delete Company
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
