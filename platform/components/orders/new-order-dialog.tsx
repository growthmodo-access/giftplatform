'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createOrder } from '@/actions/orders'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface NewOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Employee {
  id: string
  name: string | null
  email: string
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

export function NewOrderDialog({ open, onOpenChange }: NewOrderDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [shippingStreet, setShippingStreet] = useState('')
  const [shippingCity, setShippingCity] = useState('')
  const [shippingCountry, setShippingCountry] = useState('')
  const [shippingZip, setShippingZip] = useState('')

  useEffect(() => {
    if (open) {
      loadEmployees()
      loadProducts()
    }
  }, [open])

  const loadEmployees = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: userData } = await supabase
        .from('users')
        .select('company_id, role')
        .eq('id', user.id)
        .single()

      // SUPER_ADMIN can see all employees (all companies)
      let query = supabase
        .from('users')
        .select('id, name, email')
        .order('name')

      if (userData?.role !== 'SUPER_ADMIN' && userData?.company_id) {
        query = query.eq('company_id', userData.company_id)
      } else if (userData?.role !== 'SUPER_ADMIN' && !userData?.company_id) {
        // Non-SUPER_ADMIN without company_id cannot load employees
        return
      }

      const { data } = await query

      if (data) {
        setEmployees(data)
      }
    } catch (error) {
      console.error('Error loading employees:', error)
      setError('Failed to load employees')
    }
  }

  const loadProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: userData } = await supabase
        .from('users')
        .select('company_id, role')
        .eq('id', user.id)
        .single()

      // SUPER_ADMIN can see all products (all companies)
      let query = supabase
        .from('products')
        .select('id, name, price, stock')
        .order('name')

      if (userData?.role !== 'SUPER_ADMIN' && userData?.company_id) {
        query = query.eq('company_id', userData.company_id)
      } else if (userData?.role !== 'SUPER_ADMIN' && !userData?.company_id) {
        // Non-SUPER_ADMIN without company_id cannot load products
        return
      }

      const { data } = await query

      if (data) {
        setProducts(data)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      setError('Failed to load products')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!selectedEmployee || !selectedProduct) {
      setError('Please select an employee and product')
      setLoading(false)
      return
    }

    const street = shippingStreet.trim()
    const city = shippingCity.trim()
    const country = shippingCountry.trim()
    const zipCode = shippingZip.trim()
    if (!street || !city || !country || !zipCode) {
      setError('Shipping address is required. Please enter address, city, country, and postal code.')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.set('employee_id', selectedEmployee)
    formData.set('product_id', selectedProduct)
    formData.set('quantity', quantity.toString())
    formData.set('shipping_address', JSON.stringify({ street, city, country, zip_code: zipCode }))

    const result = await createOrder(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      onOpenChange(false)
      router.refresh()
      // Reset form
      setSelectedEmployee('')
      setSelectedProduct('')
      setQuantity(1)
      setShippingStreet('')
      setShippingCity('')
      setShippingCountry('')
      setShippingZip('')
    }
  }

  const selectedProductData = products.find(p => p.id === selectedProduct)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Create a new order for an employee
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
              <Label htmlFor="employee">
                Employee <span className="text-red-500">*</span>
              </Label>
              <Select 
                required 
                disabled={loading}
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name || employee.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product">
                Product <span className="text-red-500">*</span>
              </Label>
              <Select 
                required 
                disabled={loading}
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem 
                      key={product.id} 
                      value={product.id}
                      disabled={product.stock === 0}
                    >
                      {product.name} - ${product.price.toFixed(2)} 
                      {product.stock > 0 ? ` (${product.stock} in stock)` : ' (Out of stock)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedProductData?.stock || 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
                disabled={loading}
              />
              {selectedProductData && (
                <p className="text-xs text-gray-500">
                  Available: {selectedProductData.stock} | 
                  Total: ${(selectedProductData.price * quantity).toFixed(2)}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shipping_street">
                Shipping Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shipping_street"
                name="shipping_street"
                placeholder="Street address"
                value={shippingStreet}
                onChange={(e) => setShippingStreet(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="shipping_city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shipping_city"
                  name="shipping_city"
                  placeholder="City"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shipping_zip">
                  ZIP / Postal code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shipping_zip"
                  name="shipping_zip"
                  placeholder="ZIP or postal code"
                  value={shippingZip}
                  onChange={(e) => setShippingZip(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shipping_country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shipping_country"
                name="shipping_country"
                placeholder="Country"
                value={shippingCountry}
                onChange={(e) => setShippingCountry(e.target.value)}
                disabled={loading}
                required
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
            <Button
              type="submit"
              disabled={
                loading ||
                !selectedEmployee ||
                !selectedProduct ||
                !shippingStreet.trim() ||
                !shippingCity.trim() ||
                !shippingCountry.trim() ||
                !shippingZip.trim()
              }
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
