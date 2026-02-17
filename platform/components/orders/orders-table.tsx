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
import { ArrowUpDown, ArrowUp, ArrowDown, CreditCard, Wallet, Building2, Coins, Truck, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTrackingUrl } from '@/lib/order-tracking'

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
  company?: string
  companyId?: string | null
  shippingAddress?: string | null
  trackingNumber?: string | null
}

interface OrdersTableProps {
  orders: Order[]
  onOrderClick?: (order: Order) => void
}

type SortField = 'orderNumber' | 'employee' | 'amount' | 'status' | 'mobile' | 'paymentMethod' | 'company'
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
            case 'company':
              aValue = (a.company || '').toLowerCase()
              bValue = (b.company || '').toLowerCase()
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
      {/* Card layout on small/medium: no horizontal scroll; table on lg+ */}
      <div className="block lg:hidden space-y-3 p-4">
        {sortedOrders.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No orders found</p>
        ) : (
          sortedOrders.map((order) => {
            const PaymentIcon = order.paymentMethod ? paymentMethodIcons[order.paymentMethod] : null
            return (
              <div
                key={order.id}
                role="button"
                tabIndex={0}
                onClick={() => onOrderClick?.(order)}
                onKeyDown={(e) => e.key === 'Enter' && onOrderClick?.(order)}
                className="rounded-lg border border-border bg-card p-4 space-y-2 text-left hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-sm font-medium text-foreground truncate">{order.orderNumber}</span>
                  <Badge className={cn('text-xs shrink-0', statusColors[order.status] || statusColors.PENDING)}>
                    {statusLabels[order.status] || order.status || 'Pending'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                      {getInitials(order.employee || 'Unknown')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{order.employee || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground truncate">{order.company || 'N/A'}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">{order.amount || 'N/A'}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>Mobile: {order.mobile || 'N/A'}</span>
                  <span>Payment: {order.paymentMethod || 'N/A'}</span>
                  {order.trackingNumber && (
                    <span className="flex items-center gap-1">
                      <span className="font-mono">Tracking: {order.trackingNumber}</span>
                      <a href={getTrackingUrl(order.trackingNumber)} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline">Track</a>
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
      <div className="hidden lg:block w-full min-w-0 overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted border-b border-border">
              <TableHead className="w-10 shrink-0">
                <Checkbox
                  checked={selectedOrders.size === orders.length && orders.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[140px]">
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
              <TableHead className="w-[120px]">
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
              <TableHead className="min-w-0 w-[140px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 font-semibold text-foreground hover:bg-transparent truncate max-w-full"
                  onClick={() => handleSort('company')}
                >
                  COMPANY (BILL TO)
                  {getSortIcon('company')}
                </Button>
              </TableHead>
              <TableHead className="w-[110px]">
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
              <TableHead className="w-[100px]">
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
              <TableHead className="w-[100px]">
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
              <TableHead className="w-[120px]">
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
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 font-semibold text-foreground hover:bg-transparent"
                >
                  TRACKING
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
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
                    <TableCell className="font-medium text-foreground min-w-0 max-w-[140px] truncate font-mono text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="min-w-0 max-w-[120px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="w-8 h-8 shrink-0 border border-border">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                            {getInitials(order.employee || 'Unknown')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="text-sm text-foreground font-medium truncate">{order.employee || 'Unknown'}</div>
                          {order.shippingAddress && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Truck className="w-3 h-3" />
                              Ship to employee
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-0 max-w-[140px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="w-4 h-4 shrink-0 text-muted-foreground" />
                        <span className="text-sm text-foreground font-medium truncate block">{order.company || 'N/A'}</span>
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
                    <TableCell>
                      {order.trackingNumber ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Truck className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-mono text-foreground">{order.trackingNumber}</span>
                          <a
                            href={getTrackingUrl(order.trackingNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-xs text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Track <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
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
