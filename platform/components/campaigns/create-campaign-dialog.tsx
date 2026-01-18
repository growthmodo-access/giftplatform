'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCampaign } from '@/actions/campaigns'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CreateCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Product {
  id: string
  name: string
  price: number
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (open) {
      loadProducts()
    }
  }, [open])

  const loadProducts = async () => {
    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Failed to get user:', userError)
        return
      }

      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single()

      if (userDataError || !userData?.company_id) {
        console.error('Failed to get user data:', userDataError)
        return
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('company_id', userData.company_id)
        .order('name')

      if (error) {
        console.error('Failed to load products:', error)
        setError('Failed to load products. Please try again.')
      } else if (data) {
        setProducts(data)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      setError('An error occurred while loading products.')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    // Ensure trigger and product_id are included from hidden inputs
    const triggerValue = (document.getElementById('trigger-value') as HTMLInputElement)?.value
    const productIdValue = (document.getElementById('product_id-value') as HTMLInputElement)?.value
    
    if (triggerValue) {
      formData.set('trigger', triggerValue)
    }
    if (productIdValue) {
      formData.set('product_id', productIdValue)
    }
    
    const result = await createCampaign(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      onOpenChange(false)
      router.refresh()
      e.currentTarget.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Create an automated campaign to send gifts to employees. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="name">
                Campaign Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., New Hire Welcome"
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="trigger">
                Trigger Type <span className="text-red-500">*</span>
              </Label>
              <input type="hidden" name="trigger" id="trigger-value" />
              <Select 
                required 
                disabled={loading}
                onValueChange={(value) => {
                  const hiddenInput = document.getElementById('trigger-value') as HTMLInputElement
                  if (hiddenInput) hiddenInput.value = value
                }}
              >
                <SelectTrigger id="trigger">
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW_HIRE">New Hire</SelectItem>
                  <SelectItem value="BIRTHDAY">Birthday</SelectItem>
                  <SelectItem value="ANNIVERSARY">Anniversary</SelectItem>
                  <SelectItem value="PERFORMANCE">Performance</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product_id">Product (Optional)</Label>
              <input type="hidden" name="product_id" id="product_id-value" />
              <Select 
                disabled={loading}
                onValueChange={(value) => {
                  const hiddenInput = document.getElementById('product_id-value') as HTMLInputElement
                  if (hiddenInput) hiddenInput.value = value
                }}
              >
                <SelectTrigger id="product_id">
                  <SelectValue placeholder="Select a product (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
