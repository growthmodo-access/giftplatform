import { CompaniesPageClient } from '@/components/companies/companies-page-client'
import { getCompanies } from '@/actions/companies'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function CompaniesPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's role
  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (!currentUser) {
    redirect('/login')
  }

  // Check permissions - only ADMIN and SUPER_ADMIN can access
  if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const { data: companies, error } = await getCompanies()

  if (error) {
    console.error('Error fetching companies:', error)
  }

  return (
    <CompaniesPageClient
      initialCompanies={companies || []}
      currentUserRole={(currentUser.role as 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') || 'EMPLOYEE'}
    />
  )
}
