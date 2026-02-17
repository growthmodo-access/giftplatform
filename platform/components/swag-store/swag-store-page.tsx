'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { SafeImage } from '@/components/ui/safe-image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createStoreOrder } from '@/actions/swag-store'

interface SwagStorePageProps {
  storeData: {
    companyId: string
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
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [fulfillment, setFulfillment] = useState({ name: '', email: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState('')

  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }))
  }
  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const next = { ...prev }
      const q = (next[productId] || 0) - 1
      if (q <= 0) delete next[productId]
      else next[productId] = q
      return next
    })
  }
  const setQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => { const n = { ...prev }; delete n[productId]; return n })
    } else {
      setCart(prev => ({ ...prev, [productId]: qty }))
    }
  }

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  const cartItems = storeData.products.filter(p => (cart[p.id] || 0) > 0)
  const total = cartItems.reduce((sum, p) => sum + (p.price * (cart[p.id] || 0)), 0)
  const currency = storeData.products[0]?.currency || 'INR'

  const handleCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
    setOrderError('')
  }
  const handlePlaceOrder = async () => {
    const { name, email, phone, address } = fulfillment
    if (!name.trim()) {
      setOrderError('Please enter your full name')
      return
    }
    if (!email.trim()) {
      setOrderError('Please enter your email')
      return
    }
    if (!phone.trim()) {
      setOrderError('Please enter your phone number')
      return
    }
    if (!address.trim()) {
      setOrderError('Please enter shipping address')
      return
    }
    setSubmitting(true)
    setOrderError('')
    const items = cartItems.map(p => ({
      productId: p.id,
      quantity: cart[p.id] || 0,
      price: p.price,
    }))
    const result = await createStoreOrder(storeData.companyId, items, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    }, currency)
    setSubmitting(false)
    if (result.error) {
      setOrderError(result.error)
      return
    }
    setOrderSuccess(true)
    setCart({})
    setFulfillment({ name: '', email: '', phone: '', address: '' })
    setCheckoutOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {storeData.companyLogo ? (
                <SafeImage
                  src={storeData.companyLogo}
                  alt={storeData.companyName}
                  className="w-10 h-10 rounded object-contain"
                  containerClassName="w-10 h-10 rounded bg-muted"
                />
              ) : null}
              <h1 className="text-2xl font-semibold text-foreground">{storeData.companyName} Swag Store</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartCount})
                {total > 0 && (
                  <span className="ml-1">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(total)}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Dialog */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
            <DialogDescription>{cartCount} item(s)</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">Cart is empty</p>
            ) : (
              cartItems.map(p => (
                <div key={p.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium truncate flex-1">{p.name}</span>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setQuantity(p.id, (cart[p.id] || 0) - 1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{cart[p.id] || 0}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => addToCart(p.id)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <span className="text-sm font-medium w-20 text-right">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(p.price * (cart[p.id] || 0))}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="font-semibold">Total</span>
            <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(total)}</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCartOpen(false)}>Continue Shopping</Button>
            <Button onClick={handleCheckout} disabled={cartItems.length === 0}>Proceed to Checkout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Enter fulfillment details for your order</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="checkout-name">Full name</Label>
              <Input
                id="checkout-name"
                type="text"
                value={fulfillment.name}
                onChange={e => setFulfillment(f => ({ ...f, name: e.target.value }))}
                placeholder="John Doe"
                className="border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-email">Email</Label>
              <Input
                id="checkout-email"
                type="email"
                value={fulfillment.email}
                onChange={e => setFulfillment(f => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
                className="border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-phone">Phone number</Label>
              <Input
                id="checkout-phone"
                type="tel"
                value={fulfillment.phone}
                onChange={e => setFulfillment(f => ({ ...f, phone: e.target.value }))}
                placeholder="+1 234 567 8900"
                className="border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-address">Shipping address</Label>
              <Textarea
                id="checkout-address"
                value={fulfillment.address}
                onChange={e => setFulfillment(f => ({ ...f, address: e.target.value }))}
                placeholder="Street, City, State, ZIP, Country"
                rows={3}
                className="border-border/50"
              />
            </div>
          </div>
          {orderError && <p className="text-sm text-destructive">{orderError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
            <Button onClick={handlePlaceOrder} disabled={submitting}>{submitting ? 'Placing...' : 'Place Order'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order success toast */}
      {orderSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
          Order placed successfully!
        </div>
      )}

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
                    <SafeImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-48 flex items-center justify-center"
                      fallback={<Package className="w-12 h-12 text-muted-foreground" />}
                    />
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
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: product.currency || 'INR',
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
