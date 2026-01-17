import { ProductsTable } from '@/components/products/products-table'
import { Button } from '@/components/ui/button'
import { Plus, Download, Upload } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProductsPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's company_id
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user.id)
    .single()

  // Fetch products
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (userData?.company_id) {
    query = query.eq('company_id', userData.company_id)
  }

  const { data: products, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    // In production, you might want to show an error message to the user
    // For now, we'll just pass an empty array and let the component handle it
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">My products</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-gray-900 hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            Add product
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <ProductsTable initialProducts={products || []} />
      </Tabs>
    </div>
  )
}
