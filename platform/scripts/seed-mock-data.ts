/**
 * Seed mock data for all roles (SUPER_ADMIN, ADMIN, HR, MANAGER, EMPLOYEE)
 *
 * Creates products, orders, campaigns, and gifts for the test company so every
 * role has data to see when logging in. Run after create-test-users.ts.
 *
 * Usage (from platform directory):
 *   npx tsx scripts/seed-mock-data.ts
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

const TEST_COMPANY_ID = '00000000-0000-0000-0000-000000000001'
const TEST_EMAILS = [
  'superadmin@test.com',
  'admin@test.com',
  'hr@test.com',
  'manager@test.com',
  'employee@test.com',
]

async function main() {
  const supabaseUrl = env.supabase.url
  const supabaseKey = env.supabase.serviceRoleKey || env.supabase.anonKey

  if (!env.supabase.serviceRoleKey) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is required. Set it in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  console.log('Seeding mock data for all roles...\n')

  // Ensure test company exists
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('id', TEST_COMPANY_ID)
    .single()

  if (!company) {
    const { error: companyError } = await supabase.from('companies').insert({
      id: TEST_COMPANY_ID,
      name: 'Test Company',
      domain: 'testcompany.com',
      budget: 100000,
    })
    if (companyError) {
      console.error('Create company failed:', companyError.message)
      process.exit(1)
    }
    console.log('✓ Test company created')
  } else {
    console.log('✓ Test company exists')
  }

  // Get user IDs for test users (must exist from create-test-users)
  const { data: users } = await supabase
    .from('users')
    .select('id, email, role')
    .in('email', TEST_EMAILS)

  if (!users?.length) {
    console.error('No test users found. Run first: npm run seed:test-users')
    process.exit(1)
  }

  const userByEmail = Object.fromEntries(users.map((u) => [u.email, u]))
  const adminId = userByEmail['admin@test.com']?.id
  const managerId = userByEmail['manager@test.com']?.id
  const employeeId = userByEmail['employee@test.com']?.id
  const anyUserId = adminId || managerId || employeeId || users[0].id

  if (!anyUserId) {
    console.error('Need at least one test user with id')
    process.exit(1)
  }

  // Products (idempotent: only add if none for company)
  const { data: existingProducts } = await supabase
    .from('products')
    .select('id')
    .eq('company_id', TEST_COMPANY_ID)
    .limit(1)

  if (!existingProducts?.length) {
    const products = [
      { name: 'Welcome Swag Box', description: 'Branded t-shirt, mug, stickers', category: 'Swag', price: 45, sku: 'SWAG-WELCOME-001', type: 'SWAG' as const },
      { name: '$50 Gift Card', description: 'Digital gift card', category: 'Gift Card', price: 50, sku: 'GC-50-001', type: 'GIFT_CARD' as const },
      { name: 'Wireless Earbuds', description: 'Premium noise-cancelling', category: 'Electronics', price: 89, sku: 'PHYS-EARBUDS-001', type: 'PHYSICAL_GIFT' as const },
      { name: 'Wellness Experience', description: 'Spa or fitness class', category: 'Experience', price: 75, sku: 'EXP-WELLNESS-001', type: 'EXPERIENCE' as const },
    ]
    for (const p of products) {
      const { error } = await supabase.from('products').insert({
        company_id: TEST_COMPANY_ID,
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price,
        currency: 'USD',
        sku: `${p.sku}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: p.type,
        stock: 100,
      })
      if (error) console.error('Product insert:', error.message)
    }
    console.log('✓ Mock products created')
  } else {
    console.log('✓ Products already exist for test company')
  }

  // Get product IDs for orders/gifts
  const { data: products } = await supabase
    .from('products')
    .select('id, price')
    .eq('company_id', TEST_COMPANY_ID)
    .limit(4)
  const productIds = products?.map((p) => p.id) ?? []
  const firstProductId = productIds[0]
  const firstPrice = products?.[0]?.price ?? 25

  if (!firstProductId) {
    console.log('Skipping orders/campaigns/gifts (no products)')
    return
  }

  // Orders (add a few for dashboard/charts)
  const { data: existingOrders } = await supabase
    .from('orders')
    .select('id')
    .eq('company_id', TEST_COMPANY_ID)
    .limit(1)

  if (!existingOrders?.length) {
    const suffix = Date.now().toString(36)
    const orderNumbers = ['MOCK-ORD-001', 'MOCK-ORD-002', 'MOCK-ORD-003', 'MOCK-ORD-004', 'MOCK-ORD-005', 'MOCK-ORD-006'].map((n) => `${n}-${suffix}`)
    for (let i = 0; i < orderNumbers.length; i++) {
      const total = Number(firstPrice) * (i % 2 === 0 ? 2 : 1)
      const { data: order } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumbers[i],
          user_id: i % 2 === 0 ? (adminId ?? anyUserId) : (managerId ?? anyUserId),
          company_id: TEST_COMPANY_ID,
          status: i === 0 ? 'PENDING' : i === 1 ? 'PROCESSING' : 'DELIVERED',
          total,
          currency: 'USD',
        })
        .select('id')
        .single()

      if (order?.id && productIds[i % productIds.length]) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          product_id: productIds[i % productIds.length],
          quantity: 1,
          price: firstPrice,
        })
      }
    }
    console.log('✓ Mock orders created')
  } else {
    console.log('✓ Orders already exist for test company')
  }

  // Campaigns (DRAFT + SENT so campaigns list has data)
  const { data: existingCampaigns } = await supabase
    .from('campaigns')
    .select('id')
    .eq('company_id', TEST_COMPANY_ID)
    .limit(1)

  if (!existingCampaigns?.length) {
    const { error: c1 } = await supabase.from('campaigns').insert({
      name: 'Q1 Welcome Gifts',
      company_id: TEST_COMPANY_ID,
      trigger: 'NEW_HIRE',
      is_active: true,
      product_id: firstProductId,
      budget: 5000,
      status: 'SENT',
    })
    const { error: c2 } = await supabase.from('campaigns').insert({
      name: 'Summer Wellness',
      company_id: TEST_COMPANY_ID,
      trigger: 'CUSTOM',
      is_active: false,
      product_id: productIds[1] ?? firstProductId,
      budget: 3000,
      status: 'DRAFT',
    })
    if (!c1 && !c2) console.log('✓ Mock campaigns created')
    else console.error('Campaign insert errors:', c1?.message, c2?.message)
  } else {
    console.log('✓ Campaigns already exist for test company')
  }

  // Gifts (for employee so they see something in Gifts)
  if (employeeId) {
    const { data: existingGifts } = await supabase
      .from('gifts')
      .select('id')
      .eq('user_id', employeeId)
      .limit(1)

    if (!existingGifts?.length) {
      await supabase.from('gifts').insert({
        user_id: employeeId,
        product_id: firstProductId,
        message: 'Welcome to the team!',
        status: 'PENDING',
      })
      await supabase.from('gifts').insert({
        user_id: employeeId,
        product_id: productIds[1] ?? firstProductId,
        message: 'Thanks for your contribution.',
        status: 'REDEEMED',
      })
      console.log('✓ Mock gifts created for employee')
    } else {
      console.log('✓ Gifts already exist for employee')
    }
  }

  // Second company for SUPER_ADMIN (so they see multiple companies)
  const secondCompanyId = '00000000-0000-0000-0000-000000000002'
  const { data: company2 } = await supabase.from('companies').select('id').eq('id', secondCompanyId).single()
  if (!company2) {
    await supabase.from('companies').insert({
      id: secondCompanyId,
      name: 'Acme Corp',
      domain: 'acme.example.com',
      budget: 75000,
    })
    const { data: p2 } = await supabase
      .from('products')
      .insert({
        company_id: secondCompanyId,
        name: 'Acme Hat',
        category: 'Swag',
        price: 20,
        currency: 'USD',
        sku: `ACME-HAT-${Date.now()}`,
        type: 'SWAG',
      })
      .select('id')
      .single()
    if (p2?.id) {
      await supabase.from('orders').insert({
        order_number: `MOCK-ACME-001-${Date.now()}`,
        user_id: anyUserId,
        company_id: secondCompanyId,
        status: 'DELIVERED',
        total: 20,
        currency: 'USD',
      })
    }
    console.log('✓ Second company (Acme Corp) created for SUPER_ADMIN')
  }

  console.log('\n' + '='.repeat(60))
  console.log('Mock data ready for all roles')
  console.log('='.repeat(60))
  console.log('\nLog in with any test user to see data:')
  console.log('  superadmin@test.com - SUPER_ADMIN (sees 2 companies, all data)')
  console.log('  admin@test.com      - ADMIN')
  console.log('  hr@test.com         - HR')
  console.log('  manager@test.com    - MANAGER')
  console.log('  employee@test.com   - EMPLOYEE (sees gifts)')
  console.log('\nPassword for all: Test123!@#')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
