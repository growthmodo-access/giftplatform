'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Search, MoreVertical, Edit, Trash2, Package } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { deleteProduct } from '@/actions/products'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database'
import { ProductDialog } from './product-dialog'

type Product = Database['public']['Tables']['products']['Row']

interface ProductsTableProps {
  initialProducts: Product[]
  canManageProducts?: boolean
  currentUserRole: import('@/lib/roles').AppRole
}

export function ProductsTable({ initialProducts, canManageProducts = false, currentUserRole }: ProductsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
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

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const }
    if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const }
    return { label: 'In Stock', variant: 'default' as const }
  }

  const formatPrice = (price: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  return (
    <>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products by name, SKU, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border/50"
            />
          </div>
          {canManageProducts && (
            <Button
              onClick={() => {
                setSelectedProduct(null)
                setDialogOpen(true)
              }}
              size="sm"
              className="gap-2"
            >
              <Package className="w-4 h-4" />
              Add Product
            </Button>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead>SKU</TableHead>
                  {canManageProducts && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canManageProducts ? 7 : 6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock || 0)
                    return (
                      <TableRow key={product.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-lg shrink-0">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-foreground truncate">{product.name}</div>
                              {product.description && (
                                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {product.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-border/50">
                            {product.type?.replace('_', ' ') || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {product.category || '—'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">
                          {formatPrice(product.price || 0, product.currency || 'INR')}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={stockStatus.variant} className="text-xs">
                            {stockStatus.label}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {product.stock || 0} units
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                            {product.sku}
                          </code>
                        </TableCell>
                        {canManageProducts && (
                          <TableCell>
                            <TooltipProvider>
                              <DropdownMenu>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Product actions</p>
                                  </TooltipContent>
                                </Tooltip>
                                <DropdownMenuContent align="end" className="border-border/50">
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(product)}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(product)}
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TooltipProvider>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Results count */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {initialProducts.length} products
          </div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        product={selectedProduct}
        currentUserRole={currentUserRole}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="border-border/50">
              Cancel
            </AlertDialogCancel>
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
  )
}
