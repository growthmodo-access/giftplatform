'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Get enhanced analytics data
 */
export async function getEnhancedAnalytics(timeRange: '7d' | '30d' | '90d' | '1y' = '30d') {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's role and company
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('role, company_id')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError || !currentUser) {
      return { data: null, error: 'User profile not found' }
    }

    // Calculate date range
    const now = new Date()
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const previousStartDate = new Date(startDate.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    // Get orders
    let ordersQuery = supabase
      .from('orders')
      .select('id, total, currency, created_at, company_id')
      .gte('created_at', startDate.toISOString())

    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.company_id) {
      ordersQuery = ordersQuery.eq('company_id', currentUser.company_id)
    }

    const { data: orders } = await ordersQuery

    // Get previous period orders for comparison
    let prevOrdersQuery = supabase
      .from('orders')
      .select('id, total, currency, created_at, company_id')
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString())

    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.company_id) {
      prevOrdersQuery = prevOrdersQuery.eq('company_id', currentUser.company_id)
    }

    const { data: prevOrders } = await prevOrdersQuery

    // Calculate revenue
    const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0
    const prevRevenue = prevOrders?.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0

    // Get campaigns
    let campaignsQuery = supabase
      .from('campaigns')
      .select('id, is_active, created_at, company_id')
      .gte('created_at', startDate.toISOString())

    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.company_id) {
      campaignsQuery = campaignsQuery.eq('company_id', currentUser.company_id)
    }

    const { data: campaigns } = await campaignsQuery
    const activeCampaigns = campaigns?.filter(c => c.is_active).length || 0
    const prevCampaigns = [] // Simplified - would need to fetch previous period
    const campaignsChange = 0 // Simplified

    // Get gifts
    const { data: gifts } = await supabase
      .from('gifts')
      .select('id, created_at')
      .gte('created_at', startDate.toISOString())

    const giftsSent = gifts?.length || 0

    // Get employees
    let employeesQuery = supabase
      .from('users')
      .select('id, company_id, created_at')

    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.company_id) {
      employeesQuery = employeesQuery.eq('company_id', currentUser.company_id)
    }

    const { data: employees } = await employeesQuery
    const totalEmployees = employees?.length || 0
    const activeEmployees = totalEmployees // Simplified
    const employeesChange = 0 // Simplified

    // Get companies (only for SUPER_ADMIN)
    let companiesQuery = supabase
      .from('companies')
      .select('id, created_at')

    if (currentUser.role !== 'SUPER_ADMIN') {
      companiesQuery = companiesQuery.eq('id', currentUser.company_id)
    }

    const { data: companies } = await companiesQuery
    const totalCompanies = companies?.length || 0
    const activeCompanies = totalCompanies
    const companiesChange = 0

    return {
      data: {
        totalRevenue,
        revenueChange,
        totalOrders: orders?.length || 0,
        activeCampaigns,
        campaignsChange,
        giftsSent,
        totalEmployees,
        activeEmployees,
        employeesChange,
        totalCompanies,
        activeCompanies,
        companiesChange,
      },
      error: null
    }
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
