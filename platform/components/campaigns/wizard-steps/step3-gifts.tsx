'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { CampaignWizardData } from '../campaign-wizard'

interface Step3Props {
  data: CampaignWizardData
  onUpdate: (data: Partial<CampaignWizardData>) => void
}

export function CampaignStep3Gifts({ data, onUpdate }: Step3Props) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userData } = await supabase
        .from('users')
        .select('company_id, role')
        .eq('id', user.id)
        .single()

      if (userData?.company_id || userData?.role === 'SUPER_ADMIN') {
        let query = supabase
          .from('products')
          .select('*')
          .order('name')

        if (userData.role !== 'SUPER_ADMIN' && userData.company_id) {
          query = query.eq('company_id', userData.company_id)
        }

        const { data: productsData } = await query
        if (productsData) setProducts(productsData)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading products:', error)
      setLoading(false)
    }
  }

  const toggleProduct = (productId: string) => {
    const current = data.selectedProducts || []
    const updated = current.includes(productId)
      ? current.filter((id: string) => id !== productId)
      : [...current, productId]
    onUpdate({ selectedProducts: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Choose Gifts</h3>
        <p className="text-sm text-muted-foreground">
          Select how recipients will receive their gifts.
        </p>
      </div>

      <RadioGroup
        value={data.giftType}
        onValueChange={(value) => {
          onUpdate({ 
            giftType: value as 'SINGLE' | 'CATALOG' | 'BUDGET',
            selectedProducts: value === 'BUDGET' ? [] : data.selectedProducts
          })
        }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="SINGLE" id="single" />
          <Label htmlFor="single" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">Single Product</div>
            <div className="text-sm text-muted-foreground">Everyone receives the same gift</div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="CATALOG" id="catalog" />
          <Label htmlFor="catalog" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">Gift Catalog</div>
            <div className="text-sm text-muted-foreground">Recipients choose from selected products</div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="BUDGET" id="budget" />
          <Label htmlFor="budget" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">Budget-Based</div>
            <div className="text-sm text-muted-foreground">Recipients choose any gift within their budget</div>
          </Label>
        </div>
      </RadioGroup>

      {data.giftType === 'SINGLE' && (
        <div className="space-y-2">
          <Label className="text-foreground">Select Product *</Label>
          {loading ? (
            <div className="text-sm text-muted-foreground py-4">Loading products...</div>
          ) : (
            <Select
              value={data.selectedProducts?.[0] || ''}
              onValueChange={(value) => onUpdate({ selectedProducts: [value] })}
            >
              <SelectTrigger className="border-border/50">
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {products.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No products available
                  </div>
                ) : (
                  products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {data.giftType === 'CATALOG' && (
        <div className="space-y-2">
          <Label className="text-foreground">Select Products for Catalog *</Label>
          {loading ? (
            <div className="text-sm text-muted-foreground py-4">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              No products available
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-2">
              {products.map((product) => {
                const isSelected = data.selectedProducts?.includes(product.id)
                return (
                  <Card
                    key={product.id}
                    className={`cursor-pointer border-border/50 transition-all ${
                      isSelected ? 'border-foreground bg-muted/50' : 'hover:bg-muted/30'
                    }`}
                    onClick={() => toggleProduct(product.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{product.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            ${product.price}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-background" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
          {data.selectedProducts.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {data.selectedProducts.length} product{data.selectedProducts.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>
      )}

      {data.giftType === 'BUDGET' && (
        <div className="p-4 border border-border/50 rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Recipients will be able to choose any gift within their budget. Set the per-recipient budget in the next step.
          </p>
        </div>
      )}
    </div>
  )
}
