'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createProduct, updateProduct } from '@/actions/products'
import { getCompanies } from '@/actions/companies'
import { Loader2 } from 'lucide-react'
import { Database } from '@/types/database'
import { supabase } from '@/lib/supabase/client'

type Product = Database['public']['Tables']['products']['Row']

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  currentUserRole: import('@/lib/roles').AppRole
}

interface Company {
  id: string
  name: string
}

export function ProductDialog({ open, onOpenChange, product, currentUserRole }: ProductDialogProps) {
  const router = useRouter()
  const isEdit = !!product
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    sku: '',
    type: '' as 'SWAG' | 'GIFT_CARD' | 'PHYSICAL_GIFT' | 'EXPERIENCE' | '',
    company_id: '',
    currency: 'INR',
    image: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // Load companies for SUPER_ADMIN
  useEffect(() => {
    if (open && currentUserRole === 'SUPER_ADMIN') {
      loadCompanies()
    }
  }, [open, currentUserRole])

  // Populate form when editing
  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '0',
        sku: product.sku || '',
        type: product.type || '',
        company_id: product.company_id || '',
        currency: product.currency || 'INR',
        image: product.image || '',
      })
      setImagePreview(product.image || '')
      setImageFile(null)
    } else if (open && !product) {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '0',
        sku: '',
        type: '',
        company_id: '',
        currency: 'INR',
        image: '',
      })
      setImagePreview('')
      setImageFile(null)
    }
  }, [product, open])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const loadCompanies = async () => {
    setLoadingCompanies(true)
    try {
      const result = await getCompanies()
      if (result.data) {
        setCompanies(result.data)
      }
    } catch (error) {
      console.error('Error loading companies:', error)
    } finally {
      setLoadingCompanies(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form || form.nodeName !== 'FORM') {
      setError('Invalid form')
      return
    }
    setLoading(true)
    setError('')

    try {
      let imageUrl = formData.image

      // Upload image if a new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `products/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          if (uploadError.message?.toLowerCase().includes('bucket') || uploadError.message?.toLowerCase().includes('not found')) {
            throw new Error('Image upload failed: Storage bucket "product-images" not found. Create it in Supabase Dashboard → Storage → New bucket (see docs/STORAGE_SETUP.md).')
          }
          throw new Error(`Image upload failed: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      const submitFormData = new FormData(form)
      
      // Ensure type is included
      if (formData.type) {
        submitFormData.set('type', formData.type)
      }

      // Add image URL
      if (imageUrl) {
        submitFormData.set('image', imageUrl)
      }

      const result = isEdit && product
        ? await updateProduct(product.id, submitFormData)
        : await createProduct(submitFormData)

      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else {
        onOpenChange(false)
        router.refresh()
        // Reset form
        setFormData({
          name: '',
          description: '',
          category: '',
          price: '',
          stock: '0',
          sku: '',
          type: '',
          company_id: '',
          currency: 'INR',
          image: '',
        })
        setImagePreview('')
        setImageFile(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit 
              ? 'Update product information. All fields marked with * are required.'
              : 'Add a new product to your catalog. All fields marked with * are required.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            {/* Company Selection for SUPER_ADMIN */}
            {currentUserRole === 'SUPER_ADMIN' && (
              <div className="grid gap-2">
                <Label htmlFor="company_id">Company</Label>
                <Select
                  value={formData.company_id || 'none'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, company_id: value === 'none' ? '' : value }))}
                  disabled={loading || loadingCompanies}
                >
                  <SelectTrigger id="company_id" name="company_id">
                    <SelectValue placeholder={loadingCompanies ? "Loading companies..." : "Select company (optional)"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No company (Global)</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="company_id" value={formData.company_id || ''} />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Hydrate Replenish Body Oil"
                required
                disabled={loading}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-background border-border/50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="space-y-2">
                {imagePreview && (
                  <div className="relative w-full h-48 border border-border/50 rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  className="bg-background border-border/50"
                />
                <p className="text-xs text-muted-foreground">
                  Upload a product image (JPG, PNG, etc.)
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Product description..."
                disabled={loading}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-background border-border/50 min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Price <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[100px] bg-background border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                    disabled={loading}
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="flex-1 bg-background border-border/50"
                  />
                </div>
                <input type="hidden" name="currency" value={formData.currency} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  disabled={loading}
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  className="bg-background border-border/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">
                  SKU <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sku"
                  name="sku"
                  placeholder="SKU-001"
                  required
                  disabled={loading}
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  className="bg-background border-border/50"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g., Skincare, Electronics"
                  disabled={loading}
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-background border-border/50"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">
                Product Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                required
                disabled={loading}
              >
                <SelectTrigger id="type" className="bg-background border-border/50">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SWAG">SWAG</SelectItem>
                  <SelectItem value="GIFT_CARD">Gift Card</SelectItem>
                  <SelectItem value="PHYSICAL_GIFT">Physical Gift</SelectItem>
                  <SelectItem value="EXPERIENCE">Experience</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="type" value={formData.type} />
            </div>
          </div>
          <DialogFooter className="border-t border-border/50 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-border/50"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.type}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
