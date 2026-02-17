'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'
import { NewOrderDialog } from './new-order-dialog'
import { exportOrdersAsCsv } from '@/actions/orders'
import { OrderDetailsDialog } from './order-details-dialog'
import { OrdersTable } from './orders-table'
import { OrdersFilters, FilterState } from './orders-filters'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeOrders } from '@/hooks/use-realtime-orders'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import type { AppRole } from '@/lib/roles'

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
  trackingUrl?: string | null
}

interface OrdersPageClientProps {
  orders: Order[]
  currentUserRole: AppRole
  error?: string
}

const ITEMS_PER_PAGE = 10

export function OrdersPageClient({ orders, currentUserRole, error }: OrdersPageClientProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    orderId: '',
    status: 'all',
    startDate: '',
    endDate: '',
  })
  const [currentPage, setCurrentPage] = useState(1)

  const canCreateOrders = currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN'

  // Safety check for orders
  const safeOrders = orders || []

  // Filter orders based on filter state
  const filteredOrders = useMemo(() => {
    if (!safeOrders || safeOrders.length === 0) return []
    
    return safeOrders.filter(order => {
      try {
        // Name filter (employee/recipient name)
        if (filters.name) {
          const name = (order.employee || '').toLowerCase()
          if (!name.includes(filters.name.toLowerCase())) {
            return false
          }
        }

        // Order ID filter
        if (filters.orderId && order.orderNumber) {
          if (!order.orderNumber.toLowerCase().includes(filters.orderId.toLowerCase())) {
            return false
          }
        }

        // Status filter
        if (filters.status && filters.status !== 'all' && order.status !== filters.status) {
          return false
        }

        // Date range filter
        if (filters.startDate || filters.endDate) {
          try {
            const orderDate = order.dateTimestamp
              ? new Date(order.dateTimestamp)
              : order.date
                ? new Date(order.date)
                : null

            if (!orderDate || isNaN(orderDate.getTime())) {
              // Skip date filter if date is invalid
            } else {
              if (filters.startDate) {
                const startDate = new Date(filters.startDate)
                if (!isNaN(startDate.getTime())) {
                  startDate.setHours(0, 0, 0, 0)
                  if (orderDate < startDate) return false
                }
              }
              if (filters.endDate) {
                const endDate = new Date(filters.endDate)
                if (!isNaN(endDate.getTime())) {
                  endDate.setHours(23, 59, 59, 999)
                  if (orderDate > endDate) return false
                }
              }
            }
          } catch (e) {
            // Skip date filter on parse error
          }
        }

        return true
      } catch (error) {
        console.error('Filter error:', error)
        return true
      }
    })
  }, [safeOrders, filters])

  // Paginate filtered orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredOrders.slice(startIndex, endIndex)
  }, [filteredOrders, currentPage])

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  // Real-time updates for orders
  useRealtimeOrders(() => {
    router.refresh()
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Order</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sm"
            onClick={async () => {
              const { csv, error } = await exportOrdersAsCsv()
              if (error) return
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          {canCreateOrders && (
            <Button size="sm" className="gap-2 text-sm" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              New Order
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            Error loading orders: {error}
          </p>
        </div>
      )}

      {/* Filters */}
      <OrdersFilters onFilterChange={handleFilterChange} />

      {/* Orders Table or Empty State */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="w-8 h-8 text-muted-foreground" />}
            title="No orders yet"
            description="Create your first order to start sending gifts to employees or clients."
            action={canCreateOrders ? { label: 'Create your first order', onClick: () => setDialogOpen(true) } : undefined}
          />
        ) : (
          <>
            <OrdersTable 
              orders={paginatedOrders} 
              onOrderClick={(order) => {
                setSelectedOrder(order)
                setDetailsDialogOpen(true)
              }}
            />
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {canCreateOrders && (
        <NewOrderDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        open={detailsDialogOpen}
        onClose={() => {
          setDetailsDialogOpen(false)
          setSelectedOrder(null)
        }}
        onSuccess={() => {
          setDetailsDialogOpen(false)
          setSelectedOrder(null)
          window.location.reload()
        }}
        canEdit={canCreateOrders}
      />
    </div>
  )
}
