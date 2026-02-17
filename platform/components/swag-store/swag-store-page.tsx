'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, ShoppingCart, Minus, Plus, Trash2, Search } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createStoreOrder } from '@/actions/swag-store'

interface SwagStorePageProps {
  storeData: {
    companyId: string
    companyName: string
    companyLogo: string | null
    companySettings?: Record<string, unknown>
    products: Array<{
      id: string
      name: string
      description: string | null
      image: string | null
      price: number
      currency: string
      category: string
      stock?: number | null
      requires_sizes?: boolean
      sizes?: string[] | null
    }>
  }
}

const LOW_STOCK_THRESHOLD = 5

function getCartKey(productId: string, product: { requires_sizes?: boolean; sizes?: string[] | null }, size: string | null): string {
  if (product?.requires_sizes && size) return `${productId}::${size}`
  return productId
}

export function SwagStorePage({ storeData }: SwagStorePageProps) {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({}) // productId -> size for add-to-cart
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [fulfillment, setFulfillment] = useState({ name: '', email: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [priceFilter, setPriceFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  const primaryColor = (storeData.companySettings?.primaryColor as string) || undefined

  const categories = useMemo(() => {
    const set = new Set(storeData.products.map(p => p.category).filter(Boolean))
    return Array.from(set).sort()
  }, [storeData.products])

  const filteredProducts = useMemo(() => {
    let list = storeData.products
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q)) ||
        (p.category?.toLowerCase().includes(q))
      )
    }
    if (categoryFilter && categoryFilter !== 'all') {
      list = list.filter(p => p.category === categoryFilter)
    }
    if (priceFilter && priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(Number)
      list = list.filter(p => {
        const price = p.price
        if (max != null && !Number.isNaN(max)) return price >= min && price <= max
        return price >= min
      })
    }
    const sorted = [...list]
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sortBy === 'name') sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    return sorted
  }, [storeData.products, searchQuery, categoryFilter, priceFilter, sortBy])

  const getStock = (productId: string) => {
    const p = storeData.products.find(x => x.id === productId)
    return p?.stock != null ? p.stock : 999
  }

  const addToCart = (productId: string, size: string | null = null) => {
    const product = storeData.products.find(p => p.id === productId)
    const key = getCartKey(productId, product ?? {}, size)
    const stock = getStock(productId)
    if (stock <= 0) return
    if (product?.requires_sizes && product.sizes?.length && !size) return // require size selection
    setCart(prev => {
      const current = prev[key] || 0
      const nextQty = Math.min(current + 1, stock)
      if (nextQty <= 0) { const n = { ...prev }; delete n[key]; return n }
      return { ...prev, [key]: nextQty }
    })
  }
  const removeFromCart = (key: string) => {
    setCart(prev => {
      const next = { ...prev }
      const q = (next[key] || 0) - 1
      if (q <= 0) delete next[key]
      else next[key] = q
      return next
    })
  }
  const setQuantity = (key: string, qty: number) => {
    const [productId] = key.includes('::') ? key.split('::') : [key]
    const stock = getStock(productId)
    if (qty <= 0) {
      setCart(prev => { const n = { ...prev }; delete n[key]; return n })
    } else {
      setCart(prev => ({ ...prev, [key]: Math.min(qty, stock) }))
    }
  }

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  // Derive cart line items: key is productId or productId::size
  const cartEntries = Object.entries(cart).filter(([, qty]) => qty > 0).map(([key, qty]) => {
    const [productId, size] = key.includes('::') ? key.split('::') : [key, null]
    const product = storeData.products.find(p => p.id === productId)
    return { key, productId, size: size || undefined, qty, product }
  })
  const cartItems = cartEntries.filter(e => e.product) as Array<{ key: string; productId: string; size?: string; qty: number; product: NonNullable<typeof cartEntries[0]['product']> }>
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0)
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
    const items = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.qty,
      price: item.product.price,
      size: item.size ?? undefined,
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
      <header
        className="border-b border-border/50 bg-card"
        style={primaryColor ? { backgroundColor: primaryColor, borderColor: 'rgba(0,0,0,0.08)' } : undefined}
      >
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
              <h1
                className="text-2xl font-semibold"
                style={primaryColor ? { color: '#fff' } : undefined}
              >
                {storeData.companyName} Swag Store
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setCartOpen(true)}
                style={primaryColor ? { borderColor: 'rgba(255,255,255,0.6)', color: '#fff' } : undefined}
              >
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
              cartItems.map(item => (
                <div key={item.key} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium truncate flex-1">
                    {item.product.name}
                    {item.size && <span className="text-muted-foreground font-normal"> — {item.size}</span>}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setQuantity(item.key, item.qty - 1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => addToCart(item.productId, item.size ?? null)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <span className="text-sm font-medium w-20 text-right">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(item.product.price * item.qty)}
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

      {/* Search and filters */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 border-border/50"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] border-border/50 h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-[160px] border-border/50 h-9">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All prices</SelectItem>
                <SelectItem value="0-500">Under ₹500</SelectItem>
                <SelectItem value="500-1000">₹500 – ₹1,000</SelectItem>
                <SelectItem value="1000-2500">₹1,000 – ₹2,500</SelectItem>
                <SelectItem value="2500-100000">₹2,500+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] border-border/50 h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {storeData.products.length === 0 ? 'No Products Available' : 'No matching products'}
            </h2>
            <p className="text-muted-foreground">
              {storeData.products.length === 0 ? 'Check back soon for new items!' : 'Try a different search or category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {filteredProducts.map((product) => {
              const stock = product.stock != null ? product.stock : 999
              const outOfStock = stock <= 0
              const lowStock = stock > 0 && stock <= LOW_STOCK_THRESHOLD
              const needsSize = product.requires_sizes && Array.isArray(product.sizes) && product.sizes.length > 0
              const selectedSize = selectedSizes[product.id] ?? null
              const cartKey = getCartKey(product.id, product, selectedSize)
              const inCartQty = cart[cartKey] || 0
              const canAdd = !outOfStock && (!needsSize || selectedSize)
              return (
                <Card key={product.id} className="border-border/50 hover:shadow-md transition-shadow flex flex-col h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative shrink-0">
                      <div className="relative w-full h-48 bg-muted overflow-hidden">
                        <SafeImage
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          containerClassName="w-full h-48 flex items-center justify-center"
                          fallback={<Package className="w-12 h-12 text-muted-foreground" />}
                        />
                        {outOfStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge className="bg-destructive text-destructive-foreground">Out of stock</Badge>
                          </div>
                        )}
                        {lowStock && !outOfStock && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs">Low stock ({stock})</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1 min-h-[200px]">
                      <div className="min-h-[2.75rem]">
                        <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[2.5rem]">
                          {product.description || '\u00A0'}
                        </p>
                      </div>
                      <div className="min-h-[52px] flex flex-col justify-center">
                        {needsSize ? (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Size</Label>
                            <Select
                              value={selectedSize || ''}
                              onValueChange={(v) => setSelectedSizes(s => ({ ...s, [product.id]: v }))}
                            >
                              <SelectTrigger className="h-8 border-border/50">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                {product.sizes!.map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div className="h-8" aria-hidden />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2">
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
                        onClick={() => addToCart(product.id, needsSize ? selectedSize : null)}
                        disabled={!canAdd}
                      >
                        {outOfStock ? 'Out of stock' : needsSize && !selectedSize ? 'Select size' : 'Add to Cart'}
                        {inCartQty > 0 && canAdd && (
                          <span className="ml-2">({inCartQty})</span>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
