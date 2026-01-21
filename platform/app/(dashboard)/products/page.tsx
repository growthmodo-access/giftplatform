import { ProductsPageClient } from '@/components/products/products-page-client'
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

  // Get user's company_id and role
  const { data: userData } = await supabase
    .from('users')
    .select('company_id, role')
    .eq('id', user.id)
    .single()

  // Fetch products
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  // SUPER_ADMIN can see all products (all companies)
  // Other roles see only their company's products
  if (userData?.role !== 'SUPER_ADMIN' && userData?.company_id) {
    query = query.eq('company_id', userData.company_id)
  }

  const { data: products, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    // In production, you might want to show an error message to the user
    // For now, we'll just pass an empty array and let the component handle it
  }

  return (
    <ProductsPageClient 
      initialProducts={products || []} 
      currentUserRole={(userData?.role as 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') || 'EMPLOYEE'}
    />
  )
}
