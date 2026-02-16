import { redirect } from 'next/navigation'
import { BillingPageClient } from '@/components/billing/billing-page-client'
import { getInvoices, getWalletBalance } from '@/actions/billing'
import { getCachedAuth } from '@/lib/auth-server'
import { toAppRole } from '@/lib/roles'

export default async function BillingPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')

  const { data: invoices } = await getInvoices()
  const { data: wallet } = await getWalletBalance()
  const userRole = toAppRole(auth.currentUser.role)

  return (
    <BillingPageClient
      invoices={invoices || []}
      wallet={wallet}
      currentUserRole={userRole}
    />
  )
}
