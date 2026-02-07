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
    status: 'all',
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
      status: 'all',
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
    <div className="bg-white rounded-xl border border-border/60 p-4 sm:p-5 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Order ID */}
        <div className="space-y-2 lg:col-span-2 min-w-0">
          <Label htmlFor="orderId" className="text-xs font-medium text-foreground">
            Order ID
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <Input
              id="orderId"
              placeholder="Enter ID"
              value={filters.orderId}
              onChange={(e) => handleFilterChange('orderId', e.target.value)}
              className="pl-9 h-9 text-sm border-border/60 min-w-0"
            />
          </div>
        </div>

        {/* Order Status */}
        <div className="space-y-2 lg:col-span-3 min-w-0">
          <Label htmlFor="status" className="text-xs font-medium text-foreground">
            Order Status
          </Label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger id="status" className="h-9 text-sm border-border/60">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order Amount Range */}
        <div className="space-y-2 lg:col-span-2 min-w-0">
          <Label className="text-xs font-medium text-foreground">Order Amount</Label>
          <div className="flex items-center gap-2 min-w-0">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              className="h-9 text-sm border-border/60 min-w-0 flex-1"
              step="0.01"
            />
            <span className="text-muted-foreground text-xs shrink-0">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              className="h-9 text-sm border-border/60 min-w-0 flex-1"
              step="0.01"
            />
          </div>
        </div>

        {/* Order Date Range - own row on small, full width so dates don't squash mobile */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-3 min-w-0">
          <Label className="text-xs font-medium text-foreground">Order Date</Label>
          <div className="flex items-center gap-2 min-w-0">
            <Input
              type="datetime-local"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="h-9 text-sm border-border/60 min-w-0 flex-1 w-0"
            />
            <span className="text-muted-foreground text-xs shrink-0">to</span>
            <Input
              type="datetime-local"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="h-9 text-sm border-border/60 min-w-0 flex-1 w-0"
            />
          </div>
        </div>

        {/* Mobile Number - own cell, never overlaps */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-3 min-w-0">
          <Label htmlFor="mobile" className="text-xs font-medium text-foreground">
            Mobile Number
          </Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="Enter number"
            value={filters.mobile}
            onChange={(e) => handleFilterChange('mobile', e.target.value)}
            className="h-9 text-sm border-border/60 min-w-0"
          />
        </div>
      </div>
    </div>
  )
}
