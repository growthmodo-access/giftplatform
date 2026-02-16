'use client'

import { useState, useMemo } from 'react'
import { ProductsTable } from '@/components/products/products-table'
import { ProductsGrid } from '@/components/products/products-grid'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { Plus, Download, Upload, Package, Grid, List } from 'lucide-react'
import { Database } from '@/types/database'
import { ProductDialog } from './product-dialog'
import type { AppRole } from '@/lib/roles'

type Product = Database['public']['Tables']['products']['Row']

interface ProductsPageClientProps {
  initialProducts: Product[]
  currentUserRole: AppRole
}

const ITEMS_PER_PAGE = 12

export function ProductsPageClient({ initialProducts, currentUserRole }: ProductsPageClientProps) {
  const canManageProducts = currentUserRole === 'SUPER_ADMIN'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return initialProducts.slice(startIndex, endIndex)
  }, [initialProducts, currentPage])

  const totalPages = Math.ceil(initialProducts.length / ITEMS_PER_PAGE)

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
            <div className="flex items-center gap-1 border border-border/50 rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2"
                onClick={() => setViewMode('table')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="gap-2 border-border/50">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-border/50">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
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

      {/* Products View */}
      {viewMode === 'grid' ? (
        <ProductsGrid 
          initialProducts={paginatedProducts} 
          canManageProducts={canManageProducts}
          currentUserRole={currentUserRole}
        />
      ) : (
        <ProductsTable 
          initialProducts={paginatedProducts} 
          canManageProducts={canManageProducts}
          currentUserRole={currentUserRole}
        />
      )}

      {/* Pagination */}
      {initialProducts.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={initialProducts.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Product Dialog */}
      {canManageProducts && (
        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  )
}
