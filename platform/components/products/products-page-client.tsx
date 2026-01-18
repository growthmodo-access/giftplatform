'use client'

import { useState } from 'react'
import { ProductsTable } from '@/components/products/products-table'
import { Button } from '@/components/ui/button'
import { Plus, Download, Upload, Package } from 'lucide-react'
import { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']

interface ProductsPageClientProps {
  initialProducts: Product[]
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
}

export function ProductsPageClient({ initialProducts, currentUserRole }: ProductsPageClientProps) {
  // Only ADMIN and SUPER_ADMIN can create/edit/delete products
  const canManageProducts = currentUserRole === 'ADMIN' || currentUserRole === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        {canManageProducts && (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="gap-2 border-border/50">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-border/50">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-semibold text-foreground mt-1">
                {initialProducts.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Stock</p>
              <p className="text-2xl font-semibold text-foreground mt-1">
                {initialProducts.filter(p => (p.stock || 0) > 0).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-semibold text-destructive mt-1">
                {initialProducts.filter(p => (p.stock || 0) === 0).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-semibold text-foreground mt-1">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(
                  initialProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)
                )}
              </p>
            </div>
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable 
        initialProducts={initialProducts} 
        canManageProducts={canManageProducts}
        currentUserRole={currentUserRole}
      />
    </div>
  )
}
