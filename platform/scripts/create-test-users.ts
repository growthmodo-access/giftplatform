/**
 * Script to create test users for all roles
 * 
 * This script uses the service role key to create auth users and profiles
 * 
 * Usage:
 * 1. Make sure you have SUPABASE_SERVICE_ROLE_KEY in your .env.local
 * 2. Run: npx tsx scripts/create-test-users.ts
 * 
 * Default password for all users: Test123!@#
 */

import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

const TEST_PASSWORD = 'Test123!@#' // Change this if needed

const testUsers = [
  {
    email: 'superadmin@test.com',
    name: 'Super Admin User',
    role: 'SUPER_ADMIN' as const,
  },
  {
    email: 'admin@test.com',
    name: 'Admin User',
    role: 'ADMIN' as const,
  },
  {
    email: 'hr@test.com',
    name: 'HR User',
    role: 'HR' as const,
  },
  {
    email: 'manager@test.com',
    name: 'Manager User',
    role: 'MANAGER' as const,
  },
  {
    email: 'employee@test.com',
    name: 'Employee User',
    role: 'EMPLOYEE' as const,
  },
]

async function main() {
  console.log('Creating test users...\n')

  // Use service role key to create users
  const supabaseUrl = env.supabase.url
  const supabaseKey = env.supabase.serviceRoleKey || env.supabase.anonKey

  if (!env.supabase.serviceRoleKey) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is required to create auth users')
    console.error('Please set it in your .env.local file')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Create or get test company
  let companyId = '00000000-0000-0000-0000-000000000001'
  const { data: existingCompany } = await supabase
    .from('companies')
    .select('id')
    .eq('id', companyId)
    .single()

  if (!existingCompany) {
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        id: companyId,
        name: 'Test Company',
        domain: 'testcompany.com',
        budget: 100000.00,
      })
      .select()
      .single()

    if (companyError) {
      console.error('Error creating company:', companyError)
      return
    }
    console.log('✓ Created test company\n')
  } else {
    console.log('✓ Test company already exists\n')
  }

  // Create users
  for (const user of testUsers) {
    try {
      // Check if auth user already exists
      const { data: existingAuthUser } = await supabase.auth.admin.listUsers()
      const authUser = existingAuthUser?.users.find(u => u.email === user.email)

      let userId: string

      if (authUser) {
        console.log(`  ${user.email} - Auth user exists, updating profile...`)
        userId = authUser.id
      } else {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: TEST_PASSWORD,
          email_confirm: true,
          user_metadata: {
            name: user.name,
          },
        })

        if (authError) {
          console.error(`  ✗ ${user.email} - Failed to create auth user:`, authError.message)
          continue
        }

        userId = authData.user.id
        console.log(`  ✓ ${user.email} - Auth user created`)
      }

      // Create or update user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email: user.email,
          name: user.name,
          role: user.role,
          company_id: companyId,
        }, {
          onConflict: 'id',
        })
        .select()
        .single()

      if (profileError) {
        console.error(`  ✗ ${user.email} - Failed to create profile:`, profileError.message)
      } else {
        console.log(`  ✓ ${user.email} - Profile created/updated (${user.role})`)
      }
    } catch (error) {
      console.error(`  ✗ ${user.email} - Error:`, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('Test Users Created!')
  console.log('='.repeat(60))
  console.log('\nLogin Credentials (all users):')
  console.log(`Password: ${TEST_PASSWORD}\n`)
  console.log('Users:')
  testUsers.forEach(user => {
    console.log(`  ${user.email} - ${user.role}`)
  })
  console.log('\nYou can now log in with any of these accounts to test different roles.')
}

main().catch(console.error)
