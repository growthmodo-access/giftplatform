import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BillingPageClient } from '@/components/billing/billing-page-client'
import { getInvoices, getWalletBalance } from '@/actions/billing'

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role, company_id')
    .eq('id', user.id)
    .single()

  if (!currentUser) {
    redirect('/login')
  }

  const { data: invoices } = await getInvoices()
  const { data: wallet } = await getWalletBalance()

  return (
    <BillingPageClient
      invoices={invoices || []}
      wallet={wallet}
      currentUserRole={currentUser.role as any}
    />
  )
}
