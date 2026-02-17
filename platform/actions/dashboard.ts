'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCachedAuth } from '@/lib/auth-server'
import { redirect } from 'next/navigation'

/** Request-scoped: one dashboard stats run per request (page + StatsCards + SalesChart + TopProducts + RecentOrders). */
const getDashboardStatsImpl = cache(async () => {
  try {
    const auth = await getCachedAuth()
    if (!auth) redirect('/login')
    const { currentUser } = auth
    const supabase = await createClient()

    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN'
    const companyFilter = isSuperAdmin ? undefined : currentUser.company_id

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Run independent count queries in parallel to reduce latency
    let ordersQuery = supabase
      .from('orders')
      .select('id, order_number, total, created_at, status, user_id')
    if (!isSuperAdmin && companyFilter) ordersQuery = ordersQuery.eq('company_id', companyFilter)

    let employeesQuery = supabase.from('users').select('id, created_at')
    if (!isSuperAdmin && companyFilter) employeesQuery = employeesQuery.eq('company_id', companyFilter)

    let productsQuery = supabase.from('products').select('id')
    if (!isSuperAdmin && companyFilter) productsQuery = productsQuery.eq('company_id', companyFilter)

    let campaignsQuery = supabase.from('campaigns').select('id, is_active')
    if (!isSuperAdmin && companyFilter) campaignsQuery = campaignsQuery.eq('company_id', companyFilter)

    const [
      { data: allOrders },
      { data: employees },
      { data: products },
      { data: campaigns },
    ] = await Promise.all([
      ordersQuery,
      employeesQuery,
      productsQuery,
      campaignsQuery,
    ])

    const todayOrders = allOrders?.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate >= today && orderDate < tomorrow
    }) || []
    const totalOrders = allOrders?.length || 0
    const totalRevenue = allOrders?.reduce((sum, order) => sum + Number(order.total || 0), 0) || 0
    const totalEmployees = employees?.length || 0
    const totalProducts = products?.length || 0
    const activeCampaigns = campaigns?.filter(c => c.is_active).length || 0
    const totalCampaigns = campaigns?.length || 0

    let giftsQuery = supabase.from('gifts').select('id, created_at')
    if (!isSuperAdmin && companyFilter) {
      const { data: companyUsers } = await supabase.from('users').select('id').eq('company_id', companyFilter)
      const userIds = companyUsers?.map(u => u.id) || []
      giftsQuery = userIds.length > 0 ? giftsQuery.in('user_id', userIds) : giftsQuery.eq('user_id', '00000000-0000-0000-0000-000000000000')
    }
    const { data: gifts } = await giftsQuery
    const totalGifts = gifts?.length || 0

    // Calculate monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const monthlyOrders = allOrders?.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate >= thirtyDaysAgo
    }) || []
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)

    // Calculate previous month revenue for comparison
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
    const previousMonthOrders = allOrders?.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo
    }) || []
    const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)

    // Calculate revenue change percentage
    const revenueChange = previousMonthRevenue > 0 
      ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : (monthlyRevenue > 0 ? 100 : 0)

    // Get top products by order count
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, quantity, price, order_id')
    
    const orderIds = allOrders?.map(o => o.id) || []
    const relevantOrderItems = orderItems?.filter(item => orderIds.includes(item.order_id)) || []
    
    const productStats = new Map<string, { orders: number; revenue: number }>()
    relevantOrderItems.forEach(item => {
      const current = productStats.get(item.product_id) || { orders: 0, revenue: 0 }
      productStats.set(item.product_id, {
        orders: current.orders + 1,
        revenue: current.revenue + (Number(item.price) * Number(item.quantity))
      })
    })

    // Get product names
    const productIds = Array.from(productStats.keys())
    const { data: productData } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds)

    const productMap = new Map(productData?.map(p => [p.id, p.name]) || [])
    
    const topProducts = Array.from(productStats.entries())
      .map(([id, stats]) => ({
        id,
        name: productMap.get(id) || 'Unknown Product',
        orders: stats.orders,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)

    // Get recent orders (last 5)
    const recentOrdersData = allOrders
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5) || []

    // Get user and product data for recent orders
    const userIds = [...new Set(recentOrdersData.map(o => o.user_id))]
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', userIds)

    const userMap = new Map(users?.map(u => [u.id, u]) || [])

    // Get order items for recent orders
    const recentOrderIds = recentOrdersData.map(o => o.id)
    const { data: recentOrderItems } = await supabase
      .from('order_items')
      .select('order_id, product_id')
      .in('order_id', recentOrderIds)

    const productIdsForRecent = [...new Set(recentOrderItems?.map(item => item.product_id) || [])]
    const { data: recentProducts } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIdsForRecent)

    const productMapForRecent = new Map(recentProducts?.map(p => [p.id, p.name]) || [])
    const orderItemMap = new Map<string, string>()
    recentOrderItems?.forEach(item => {
      if (!orderItemMap.has(item.order_id)) {
        orderItemMap.set(item.order_id, item.product_id)
      }
    })

    const recentOrders = recentOrdersData.map(order => {
      const user = userMap.get(order.user_id)
      const productId = orderItemMap.get(order.id)
      const productName = productId ? productMapForRecent.get(productId) : 'Unknown Product'
      
      return {
        id: order.id,
        orderNumber: order.order_number || `ORD-${order.id.substring(0, 8)}`,
        employee: user?.name || user?.email || 'Unknown',
        employeeEmail: user?.email || '',
        employeeId: order.user_id,
        product: productName,
        amount: `${(order as any).currency === 'USD' ? '$' : '₹'}${Number(order.total).toFixed(2)}`,
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    })

    // Get revenue chart data (last 7 days)
    const chartData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayOrders = allOrders?.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate >= date && orderDate < nextDate
      }) || []

      const dayRevenue = isSuperAdmin
      ? dayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)
      : 0

      chartData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue,
        orders: dayOrders.length
      })
    }

    // Zero out revenue for non-SUPER_ADMIN (sensitive; platform-level only)
    const safeTotalRevenue = isSuperAdmin ? totalRevenue : 0
    const safeMonthlyRevenue = isSuperAdmin ? monthlyRevenue : 0
    const safeRevenueChange = isSuperAdmin ? Math.round(revenueChange * 10) / 10 : 0
    const safeTopProducts = topProducts.map((p) => ({
      ...p,
      revenue: isSuperAdmin ? p.revenue : 0
    }))

    return {
      canViewRevenue: isSuperAdmin,
      stats: {
        todayOrders: todayOrders.length,
        totalOrders,
        totalRevenue: safeTotalRevenue,
        totalEmployees,
        totalProducts,
        activeCampaigns,
        totalCampaigns,
        totalGifts,
        monthlyRevenue: safeMonthlyRevenue,
        revenueChange: safeRevenueChange
      },
      topProducts: safeTopProducts,
      recentOrders,
      chartData
    }
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return {
      canViewRevenue: false,
      stats: {
        todayOrders: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalEmployees: 0,
        totalProducts: 0,
        activeCampaigns: 0,
        totalCampaigns: 0,
        totalGifts: 0,
        monthlyRevenue: 0,
        revenueChange: 0
      },
      topProducts: [],
      recentOrders: [],
      chartData: []
    }
  }
})

export async function getDashboardStats() {
  return getDashboardStatsImpl()
}
