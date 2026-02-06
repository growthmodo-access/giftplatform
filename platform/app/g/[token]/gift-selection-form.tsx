'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { submitGiftSelection } from '@/actions/campaign-recipients'
import { Loader2, Check } from 'lucide-react'
import Image from 'next/image'

type Product = {
  id: string
  name: string
  description: string | null
  image: string | null
  price: number
  currency: string
}

interface GiftSelectionFormProps {
  token: string
  campaignName: string
  products: Product[]
  recipientEmail: string
}

export function GiftSelectionForm({ token, campaignName, products, recipientEmail }: GiftSelectionFormProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [shipping, setShipping] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  })
  const [sizeColor, setSizeColor] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId) {
      setError('Please select a gift.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await submitGiftSelection(token, {
        productId: selectedProductId,
        shippingAddress: shipping,
        sizeColorPreference: sizeColor ? { note: sizeColor } : undefined,
      })
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="rounded-full bg-success/10 p-3">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Thank you!</h2>
            <p className="text-muted-foreground max-w-sm">
              Your gift selection has been saved. We’ll send a confirmation to <strong>{recipientEmail}</strong> and
              will process your order soon.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No gifts are available for this campaign right now.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <Label className="text-foreground mb-3 block">Select your gift</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <Card
              key={product.id}
              className={`cursor-pointer border-2 transition-colors ${
                selectedProductId === product.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 hover:border-primary/50'
              }`}
              onClick={() => setSelectedProductId(product.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {product.image ? (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      Gift
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{product.name}</p>
                    {product.description && (
                      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                    )}
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {product.currency === 'INR' ? '₹' : '$'}
                      {product.price.toLocaleString()}
                    </p>
                  </div>
                  {selectedProductId === product.id && (
                    <div className="flex shrink-0 items-center">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Shipping address</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="street" className="text-foreground">Street address</Label>
            <Input
              id="street"
              value={shipping.street}
              onChange={(e) => setShipping((s) => ({ ...s, street: e.target.value }))}
              placeholder="Address line 1"
              className="mt-1.5 border-border/50"
              required
            />
          </div>
          <div>
            <Label htmlFor="city" className="text-foreground">City</Label>
            <Input
              id="city"
              value={shipping.city}
              onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
              className="mt-1.5 border-border/50"
              required
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-foreground">State</Label>
            <Input
              id="state"
              value={shipping.state}
              onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
              className="mt-1.5 border-border/50"
            />
          </div>
          <div>
            <Label htmlFor="zip" className="text-foreground">ZIP / PIN</Label>
            <Input
              id="zip"
              value={shipping.zip}
              onChange={(e) => setShipping((s) => ({ ...s, zip: e.target.value }))}
              className="mt-1.5 border-border/50"
              required
            />
          </div>
          <div>
            <Label htmlFor="country" className="text-foreground">Country</Label>
            <Input
              id="country"
              value={shipping.country}
              onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))}
              className="mt-1.5 border-border/50"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="size_color" className="text-foreground">Size / color (optional)</Label>
        <Input
          id="size_color"
          value={sizeColor}
          onChange={(e) => setSizeColor(e.target.value)}
          placeholder="e.g. M, Blue"
          className="border-border/50"
        />
      </div>

      {error && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Confirm selection'
        )}
      </Button>
    </form>
  )
}
