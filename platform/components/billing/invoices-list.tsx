'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Building2 } from 'lucide-react'

interface Invoice {
  id: string
  invoiceNumber: string
  orderId: string | null
  companyName: string
  amount: string
  status: string
  dueDate: string
  createdAt: string
}

interface InvoicesListProps {
  invoices: Invoice[]
  showCompany?: boolean
}

const statusColors: Record<string, string> = {
  PAID: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  PENDING: 'bg-amber-100 text-amber-700 border border-amber-200',
  OVERDUE: 'bg-red-100 text-red-700 border border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-700 border border-gray-200',
}

export function InvoicesList({ invoices, showCompany = true }: InvoicesListProps) {
  if (invoices.length === 0) {
    return (
      <Card className="rounded-xl border border-border/40 bg-white shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No invoices found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border border-border/40 bg-white shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto min-w-0">
          <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="font-semibold">Invoice #</TableHead>
              {showCompany && (
                <TableHead className="font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> Company
                  </span>
                </TableHead>
              )}
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} className="border-border/40">
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                {showCompany && (
                  <TableCell>
                    <span className="font-medium text-foreground">{invoice.companyName}</span>
                  </TableCell>
                )}
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge className={statusColors[invoice.status] || statusColors.PENDING}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
