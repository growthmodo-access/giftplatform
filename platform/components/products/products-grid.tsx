'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, Package, Grid, List } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Database } from '@/types/database'
import { deleteProduct } from '@/actions/products'
import { useRouter } from 'next/navigation'
import { ProductDialog } from './product-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Image from 'next/image'

type Product = Database['public']['Tables']['products']['Row']

interface ProductsGridProps {
  initialProducts: Product[]
  canManageProducts?: boolean
  currentUserRole: import('@/lib/roles').AppRole
}

export function ProductsGrid({ initialProducts, canManageProducts = false, currentUserRole }: ProductsGridProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return initialProducts

    const query = searchQuery.toLowerCase()
    return initialProducts.filter((product) => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      )
    })
  }, [initialProducts, searchQuery])

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    setDeleting(true)
    const result = await deleteProduct(productToDelete.id)

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
      setDeleting(false)
    } else {
      toast({
        variant: "success",
        title: "Product Deleted",
        description: "Product deleted successfully.",
      })
      setDeleteDialogOpen(false)
      setProductToDelete(null)
      router.refresh()
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedProduct(null)
  }

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const }
    if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const }
    return { label: 'In Stock', variant: 'default' as const }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-background border-border/50"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No products found matching your search.' : 'No products available.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock || 0)
            return (
              <Card key={product.id} className="border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative w-full h-48 bg-muted overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name || 'Product'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    {canManageProducts && (
                      <TooltipProvider>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-7 w-7 p-0"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit product</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 w-7 p-0"
                                onClick={() => handleDeleteClick(product)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete product</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">
                        {formatPrice(product.price || 0, product.currency || 'USD')}
                      </span>
                      <Badge variant={stockStatus.variant} className="text-xs">
                        {stockStatus.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>SKU: {product.sku}</span>
                      <span>Stock: {product.stock || 0}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {product.type}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Dialog */}
      {canManageProducts && (
        <>
          <ProductDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            product={selectedProduct}
            currentUserRole={currentUserRole}
          />
          
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
