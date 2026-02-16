import { CompaniesPageClient } from '@/components/companies/companies-page-client'
import { getCompanies } from '@/actions/companies'
import { getCachedAuth } from '@/lib/auth-server'
import { toAppRole } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function CompaniesPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')

  const userRole = toAppRole(auth.currentUser.role)
  if (userRole !== 'SUPER_ADMIN') redirect('/dashboard')

  const { data: companies, error } = await getCompanies()
  if (error) console.error('Error fetching companies:', error)

  return (
    <CompaniesPageClient
      initialCompanies={companies || []}
      currentUserRole="SUPER_ADMIN"
    />
  )
}
