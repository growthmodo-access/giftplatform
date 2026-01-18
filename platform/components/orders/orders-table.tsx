'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowUpDown, ArrowUp, ArrowDown, CreditCard, Wallet, Building2, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

type Order = {
  id: string
  orderNumber: string
  employee: string
  employeeEmail?: string
  product: string
  amount: string
  status: string
  date: string
  dateTimestamp?: string
  mobile?: string
  paymentMethod?: string
}

interface OrdersTableProps {
  orders: Order[]
  onOrderClick?: (order: Order) => void
}

type SortField = 'orderNumber' | 'employee' | 'amount' | 'status' | 'mobile' | 'paymentMethod'
type SortDirection = 'asc' | 'desc' | null

const statusColors: Record<string, string> = {
  DELIVERED: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  SHIPPED: 'bg-blue-100 text-blue-700 border border-blue-200',
  PROCESSING: 'bg-amber-100 text-amber-700 border border-amber-200',
  PENDING: 'bg-orange-100 text-orange-700 border border-orange-200',
  CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
  'In Progress': 'bg-blue-100 text-blue-700 border border-blue-200',
}

const statusLabels: Record<string, string> = {
  DELIVERED: 'Delivered',
  SHIPPED: 'Shipped',
  PROCESSING: 'Processing',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled',
}

const paymentMethodIcons: Record<string, any> = {
  'Credit Card': CreditCard,
  'Bank Transfer': Building2,
  'Crypto': Coins,
  'PayPal': Wallet,
}

export function OrdersTable({ orders, onOrderClick }: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return []
    if (!sortField || !sortDirection) return orders

    try {
      return [...orders].sort((a, b) => {
        let aValue: any
        let bValue: any

        try {
          switch (sortField) {
            case 'orderNumber':
              aValue = a.orderNumber || ''
              bValue = b.orderNumber || ''
              break
            case 'employee':
              aValue = (a.employee || '').toLowerCase()
              bValue = (b.employee || '').toLowerCase()
              break
            case 'amount':
              aValue = parseFloat((a.amount || '0').replace(/[^0-9.]/g, '')) || 0
              bValue = parseFloat((b.amount || '0').replace(/[^0-9.]/g, '')) || 0
              break
            case 'status':
              aValue = a.status || ''
              bValue = b.status || ''
              break
            case 'mobile':
              aValue = a.mobile || ''
              bValue = b.mobile || ''
              break
            case 'paymentMethod':
              aValue = a.paymentMethod || ''
              bValue = b.paymentMethod || ''
              break
            default:
              return 0
          }

          if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
          if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
          return 0
        } catch (error) {
          console.error('Sort error:', error)
          return 0
        }
      })
    } catch (error) {
      console.error('Sorting error:', error)
      return orders
    }
  }, [orders, sortField, sortDirection])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(new Set(orders.map(o => o.id)))
    } else {
      setSelectedOrders(new Set())
    }
  }

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders)
    if (checked) {
      newSelected.add(orderId)
    } else {
      newSelected.delete(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    try {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'
    } catch {
      return name[0]?.toUpperCase() || 'U'
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-muted-foreground" />
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3.5 h-3.5 ml-1 text-foreground" />
    }
    return <ArrowDown className="w-3.5 h-3.5 ml-1 text-foreground" />
  }

  return (
    <div className="bg-background rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted border-b border-border">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedOrders.size === orders.length && orders.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 font-semibold text-foreground hover:bg-transparent"
                  onClick={() => handleSort('orderNumber')}
                >
                  ORDER ID
                  {getSortIcon('orderNumber')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 font-semibold text-foreground hover:bg-transparent"
                  onClick={() => handleSort('employee')}
                >
                  CUSTOMER
                  {getSortIcon('employee')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 font-semibold text-foreground hover:bg-transparent"
                  onClick={() => handleSort('amount')}
                >
                  ORDER AMOUNT
                  {getSortIcon('amount')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 font-semibold text-foreground hover:bg-transparent"
                  onClick={() => handleSort('status')}
                >
                  STATUS
                  {getSortIcon('status')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 font-semibold text-foreground hover:bg-transparent"
                  onClick={() => handleSort('mobile')}
                >
                  MOBILE
                  {getSortIcon('mobile')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 font-semibold text-foreground hover:bg-transparent"
                  onClick={() => handleSort('paymentMethod')}
                >
                  PAYMENT METHOD
                  {getSortIcon('paymentMethod')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              sortedOrders.map((order) => {
                const PaymentIcon = order.paymentMethod ? paymentMethodIcons[order.paymentMethod] : null
                return (
                  <TableRow
                    key={order.id}
                    className="hover:bg-accent cursor-pointer border-b border-border"
                    onClick={() => onOrderClick?.(order)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.has(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 border border-border">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                            {getInitials(order.employee || 'Unknown')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground font-medium">{order.employee || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      {order.amount || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        'text-xs font-medium px-2.5 py-0.5',
                        statusColors[order.status] || statusColors.PENDING
                      )}>
                        {statusLabels[order.status] || order.status || 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.mobile || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {order.paymentMethod ? (
                        <div className="flex items-center gap-2">
                          {PaymentIcon && <PaymentIcon className="w-4 h-4 text-muted-foreground" />}
                          <span className="text-sm text-foreground">{order.paymentMethod}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
