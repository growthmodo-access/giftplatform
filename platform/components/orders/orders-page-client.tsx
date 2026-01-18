'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { NewOrderDialog } from './new-order-dialog'
import { OrdersTable } from './orders-table'
import { OrdersFilters, FilterState } from './orders-filters'
import { Pagination } from '@/components/ui/pagination'

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

interface OrdersPageClientProps {
  orders: Order[]
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
}

const ITEMS_PER_PAGE = 10

export function OrdersPageClient({ orders, currentUserRole }: OrdersPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    orderId: '',
    status: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    mobile: '',
  })
  const [currentPage, setCurrentPage] = useState(1)

  // Only ADMIN, MANAGER, and SUPER_ADMIN can create orders (HR cannot)
  const canCreateOrders = currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER' || currentUserRole === 'SUPER_ADMIN'

  // Filter orders based on filter state
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Order ID filter
      if (filters.orderId && !order.orderNumber.toLowerCase().includes(filters.orderId.toLowerCase())) {
        return false
      }

      // Status filter
      if (filters.status && order.status !== filters.status) {
        return false
      }

      // Amount range filter
      const orderAmount = parseFloat(order.amount.replace(/[^0-9.]/g, ''))
      if (filters.minAmount && orderAmount < parseFloat(filters.minAmount)) {
        return false
      }
      if (filters.maxAmount && orderAmount > parseFloat(filters.maxAmount)) {
        return false
      }

      // Date range filter (using timestamp if available, otherwise parse formatted date)
      if (filters.startDate || filters.endDate) {
        const orderDate = order.dateTimestamp 
          ? new Date(order.dateTimestamp)
          : new Date(order.date)
        
        if (filters.startDate) {
          const startDate = new Date(filters.startDate)
          startDate.setHours(0, 0, 0, 0)
          if (orderDate < startDate) {
            return false
          }
        }
        if (filters.endDate) {
          const endDate = new Date(filters.endDate)
          endDate.setHours(23, 59, 59, 999) // Include entire end date
          if (orderDate > endDate) {
            return false
          }
        }
      }

      // Mobile filter
      if (filters.mobile && order.mobile && !order.mobile.includes(filters.mobile)) {
        return false
      }

      return true
    })
  }, [orders, filters])

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Order</h1>
        </div>
        {canCreateOrders && (
          <Button 
            size="sm"
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-sm"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        )}
      </div>

      {/* Filters */}
      <OrdersFilters onFilterChange={handleFilterChange} />

      {/* Orders Table */}
      <div className="space-y-4">
        <OrdersTable orders={paginatedOrders} />
        
        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {canCreateOrders && (
        <NewOrderDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </div>
  )
}
