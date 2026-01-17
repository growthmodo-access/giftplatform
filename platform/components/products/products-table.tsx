'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Search, Filter, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']

interface ProductsTableProps {
  initialProducts: Product[]
}

const statusColors: Record<string, string> = {
  Scoping: 'bg-blue-100 text-blue-700',
  Quoting: 'bg-green-100 text-green-700',
  Production: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-gray-100 text-gray-700',
}

export function ProductsTable({ initialProducts }: ProductsTableProps) {
  // For now, we'll use mock data to match the design
  // In production, this would come from the database
  const products = initialProducts.length > 0 ? initialProducts : [
    {
      id: '1',
      name: 'Hydrate replenish (body oil)',
      description: null,
      image: null,
      category: 'Skincare',
      price: 29.99,
      currency: 'USD',
      sku: 'SKU-001',
      type: 'PHYSICAL_GIFT' as const,
      company_id: null,
      stock: 45,
      warehouse_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Illumination (mask)',
      description: null,
      image: null,
      category: 'Skincare',
      price: 24.99,
      currency: 'USD',
      sku: 'SKU-002',
      type: 'PHYSICAL_GIFT' as const,
      company_id: null,
      stock: 45,
      warehouse_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Mecca cosmetica',
      description: null,
      image: null,
      category: 'Skincare',
      price: 39.99,
      currency: 'USD',
      sku: 'SKU-003',
      type: 'PHYSICAL_GIFT' as const,
      company_id: null,
      stock: 0,
      warehouse_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  // Mock status for display (in production, this would be a separate field)
  const getStatus = (product: Product) => {
    if (product.stock === 0) return 'Production'
    return 'Scoping'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Q Search" className="pl-10 bg-white" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="outline">
          Sort <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="outline">Add</Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-8 gap-2">
                  Product <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Inventory (count)</TableHead>
              <TableHead>Incoming (count)</TableHead>
              <TableHead>Out of Stock</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const status = getStatus(product)
              return (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl">
                        📦
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[status] || statusColors['Scoping']}>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={product.stock === 0 ? 'text-red-600' : ''}>
                      {product.stock} in stock
                    </span>
                  </TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>11</TableCell>
                  <TableCell>
                    <Badge variant="outline">A</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
