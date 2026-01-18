'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OrdersFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  orderId: string
  status: string
  minAmount: string
  maxAmount: string
  startDate: string
  endDate: string
  mobile: string
}

export function OrdersFilters({ onFilterChange }: OrdersFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    orderId: '',
    status: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    mobile: '',
  })

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClear = () => {
    const clearedFilters: FilterState = {
      orderId: '',
      status: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      mobile: '',
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Order ID */}
        <div className="space-y-2">
          <Label htmlFor="orderId" className="text-xs font-medium text-gray-700">
            Order ID
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="orderId"
              placeholder="Enter ID"
              value={filters.orderId}
              onChange={(e) => handleFilterChange('orderId', e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Order Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-xs font-medium text-gray-700">
            Order Status
          </Label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger id="status" className="h-9 text-sm">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order Amount Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">Order Amount</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.00"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              className="h-9 text-sm"
              step="0.01"
            />
            <span className="text-gray-400 text-sm">to</span>
            <Input
              type="number"
              placeholder="0.00"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              className="h-9 text-sm"
              step="0.01"
            />
          </div>
        </div>

        {/* Order Date Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">Order Date</Label>
          <div className="flex items-center gap-2">
            <Input
              type="datetime-local"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="h-9 text-sm"
            />
            <span className="text-gray-400 text-sm">to</span>
            <Input
              type="datetime-local"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-xs font-medium text-gray-700">
            Mobile Number
          </Label>
          <Input
            id="mobile"
            placeholder="Enter number"
            value={filters.mobile}
            onChange={(e) => handleFilterChange('mobile', e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>
    </div>
  )
}
