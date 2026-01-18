'use client'

import { useState } from 'react'
import { ProductsTable } from '@/components/products/products-table'
import { AddProductDialog } from '@/components/products/add-product-dialog'
import { Button } from '@/components/ui/button'
import { Plus, Download, Upload } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']

interface ProductsPageClientProps {
  initialProducts: Product[]
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
}

export function ProductsPageClient({ initialProducts, currentUserRole }: ProductsPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  // Only ADMIN and SUPER_ADMIN can create/edit/delete products
  const canManageProducts = currentUserRole === 'ADMIN' || currentUserRole === 'SUPER_ADMIN'

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">My products</p>
        </div>
        {canManageProducts && (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button 
              size="sm"
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs sm:text-sm"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add product</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <ProductsTable initialProducts={initialProducts} canManageProducts={canManageProducts} />
      </Tabs>

      <AddProductDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
