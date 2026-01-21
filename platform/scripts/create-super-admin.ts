/**
 * Script to create or update a user to SUPER_ADMIN role
 * 
 * Usage:
 * 1. Make sure you have SUPABASE_SERVICE_ROLE_KEY in your .env.local
 * 2. Run: npx tsx scripts/create-super-admin.ts your-email@example.com
 */

import { updateUserRoleByEmail } from '@/actions/admin'

async function main() {
  const email = process.argv[2]
  
  if (!email) {
    console.error('Usage: npx tsx scripts/create-super-admin.ts <email>')
    console.error('Example: npx tsx scripts/create-super-admin.ts kunal@growthmodo.com')
    process.exit(1)
  }

  console.log(`Updating ${email} to SUPER_ADMIN...`)
  
  const result = await updateUserRoleByEmail(email, 'SUPER_ADMIN')
  
  if (result.error) {
    console.error('Error:', result.error)
    process.exit(1)
  }
  
  console.log('Success:', result.message)
  console.log('User data:', JSON.stringify(result.data, null, 2))
}

main().catch(console.error)
