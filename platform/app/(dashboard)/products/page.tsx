import { ProductsPageClient } from '@/components/products/products-page-client'
import { createClient } from '@/lib/supabase/server'
import { getCachedAuth } from '@/lib/auth-server'
import { toAppRole } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function ProductsPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')

  const supabase = await createClient()
  const { data: userData } = await supabase.from('users').select('company_id, role').eq('id', auth.user.id).single()

  let query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (userData?.role !== 'SUPER_ADMIN' && userData?.company_id) {
    query = query.eq('company_id', userData.company_id)
  }
  const { data: products, error } = await query
  if (error) console.error('Error fetching products:', error)

  const userRole = toAppRole(auth.currentUser.role)
  return (
    <ProductsPageClient
      initialProducts={products || []}
      currentUserRole={userRole}
    />
  )
}
