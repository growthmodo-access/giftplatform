'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Search, X, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export interface FilterState {
  name: string
  orderId: string
  status: string
  startDate: string
  endDate: string
}

interface OrdersFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export function OrdersFilters({ onFilterChange }: OrdersFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    orderId: '',
    status: 'all',
    startDate: '',
    endDate: '',
  })
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date)
    handleFilterChange('startDate', date ? date.toISOString().slice(0, 10) : '')
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date)
    handleFilterChange('endDate', date ? date.toISOString().slice(0, 10) : '')
  }

  const handleClear = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    const clearedFilters: FilterState = {
      name: '',
      orderId: '',
      status: 'all',
      startDate: '',
      endDate: '',
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.name !== '' ||
    filters.orderId !== '' ||
    filters.status !== 'all' ||
    filters.startDate !== '' ||
    filters.endDate !== ''

  return (
    <div className="rounded-xl border border-border/40 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs text-muted-foreground hover:text-foreground h-8">
            <X className="w-3.5 h-3.5 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Name */}
        <div className="space-y-2 lg:col-span-2 min-w-0">
          <Label htmlFor="name" className="text-xs font-medium text-foreground">
            Name
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <Input
              id="name"
              placeholder="Search by name"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="pl-9 h-9 text-sm border-border/50 min-w-0"
            />
          </div>
        </div>

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
              className="pl-9 h-9 text-sm border-border/50 min-w-0"
            />
          </div>
        </div>

        {/* Order Status */}
        <div className="space-y-2 lg:col-span-2 min-w-0">
          <Label htmlFor="status" className="text-xs font-medium text-foreground">
            Order Status
          </Label>
          <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
            <SelectTrigger id="status" className="h-9 text-sm border-border/50">
              <SelectValue placeholder="All Statuses" />
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

        {/* Order Date From */}
        <div className="space-y-2 lg:col-span-2 min-w-0">
          <Label className="text-xs font-medium text-foreground">From date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-9 w-full justify-start text-left font-normal text-sm border-border/50',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                {startDate ? format(startDate, 'dd/MM/yyyy') : 'dd/mm/yyyy'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-border/50" align="start">
              <Calendar mode="single" selected={startDate} onSelect={handleStartDateSelect} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Order Date To */}
        <div className="space-y-2 lg:col-span-2 min-w-0">
          <Label className="text-xs font-medium text-foreground">To date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-9 w-full justify-start text-left font-normal text-sm border-border/50',
                  !endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                {endDate ? format(endDate, 'dd/MM/yyyy') : 'dd/mm/yyyy'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-border/50" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateSelect}
                disabled={startDate ? (d) => d < startDate : undefined}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
