'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

interface SwagStorePageProps {
  storeData: {
    companyName: string
    companyLogo: string | null
    products: Array<{
      id: string
      name: string
      description: string | null
      image: string | null
      price: number
      currency: string
      category: string
    }>
  }
}

export function SwagStorePage({ storeData }: SwagStorePageProps) {
  const [cart, setCart] = useState<Record<string, number>>({})

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  const total = storeData.products.reduce((sum, product) => {
    const qty = cart[product.id] || 0
    return sum + (product.price * qty)
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {storeData.companyLogo && (
                <img 
                  src={storeData.companyLogo} 
                  alt={storeData.companyName}
                  className="w-10 h-10 rounded"
                />
              )}
              <h1 className="text-2xl font-semibold text-foreground">{storeData.companyName} Swag Store</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartCount})
                {total > 0 && (
                  <span className="ml-1">${total.toFixed(2)}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        {storeData.products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Products Available</h2>
            <p className="text-muted-foreground">Check back soon for new items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {storeData.products.map((product) => (
              <Card key={product.id} className="border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative w-full h-48 bg-muted overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: product.currency || 'USD',
                        }).format(product.price)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <Button 
                      className="w-full mt-2"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                      {cart[product.id] > 0 && (
                        <span className="ml-2">({cart[product.id]})</span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
