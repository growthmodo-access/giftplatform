'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Edit, Users, ShoppingCart, DollarSign } from 'lucide-react'

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

interface CompaniesTableProps {
  companies: Company[]
  onEdit: (company: Company) => void
  canEdit: boolean
  showRevenue?: boolean
}

export function CompaniesTable({ companies, onEdit, canEdit, showRevenue = true }: CompaniesTableProps) {
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead className="text-foreground font-semibold">Company</TableHead>
            <TableHead className="text-foreground font-semibold">Domain</TableHead>
            <TableHead className="text-foreground font-semibold">Employees</TableHead>
            <TableHead className="text-foreground font-semibold">Orders</TableHead>
            {showRevenue && <TableHead className="text-foreground font-semibold">Revenue</TableHead>}
            <TableHead className="text-foreground font-semibold">Budget</TableHead>
            {canEdit && (
              <TableHead className="text-foreground font-semibold w-[100px]">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id} className="border-border/50 hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      <Building2 className="w-5 h-5 text-background" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{company.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(company.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {company.domain ? (
                  <span className="text-sm text-foreground">{company.domain}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{company.employeeCount}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{company.orderCount}</span>
                </div>
              </TableCell>
              {showRevenue && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      ${(company.revenue / 1000).toFixed(1)}k
                    </span>
                  </div>
                </TableCell>
              )}
              <TableCell>
                <span className="text-sm text-foreground">
                  ${company.budget.toLocaleString()}
                </span>
              </TableCell>
              {canEdit && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(company)}
                    className="border-border/50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
