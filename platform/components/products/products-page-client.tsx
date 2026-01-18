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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">My products</p>
        </div>
        <div className="flex gap-3">
          {canManageProducts && (
            <>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button 
                className="gap-2 bg-gray-900 hover:bg-gray-800"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add product
              </Button>
            </>
          )}
        </div>
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
